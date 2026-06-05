import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Alerting thresholds.
const REPEATED_BLOCK_THRESHOLD = 5;       // blocked attempts from one client in 24h
const TRAFFIC_SPIKE_PER_HOUR = 25;        // security events in the last hour
const QUOTA_DRAIN_TOKENS_24H = 60000;     // total tokens burned in 24h across all clients

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ownerKey } = await req.json().catch(() => ({ ownerKey: '' }));
    const OWNER_PASSCODE = Deno.env.get('OWNER_PASSCODE');

    if (!OWNER_PASSCODE || typeof ownerKey !== 'string' || ownerKey !== OWNER_PASSCODE) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Backend not configured');
    const admin = createClient(supabaseUrl, serviceKey);

    const now = Date.now();
    const since7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const since24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const since1h = new Date(now - 60 * 60 * 1000).toISOString();

    // Recent events (cap 1000 for the 7-day window).
    const { data: events = [] } = await admin
      .from('security_events')
      .select('*')
      .gte('created_at', since7d)
      .order('created_at', { ascending: false })
      .limit(1000);

    const evs = events || [];
    const in24h = evs.filter((e: any) => e.created_at >= since24h);
    const in1h = evs.filter((e: any) => e.created_at >= since1h);

    const countBy = (arr: any[], key: string) =>
      arr.reduce((acc: Record<string, number>, e: any) => {
        const k = e[key] ?? 'unknown';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});

    const byType = countBy(evs, 'event_type');
    const bySeverity = countBy(evs, 'severity');

    // Repeated blocked attempts per client (24h).
    const blocks24h = in24h.filter((e: any) => e.event_type === 'limit_blocked');
    const blocksByClient = countBy(blocks24h, 'ip_hash');
    const repeatOffenders = Object.entries(blocksByClient)
      .map(([ip_hash, count]) => ({ ip_hash, count }))
      .filter((o) => o.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Hourly traffic buckets over 24h (security-event volume).
    const hourly: { hour: string; count: number }[] = [];
    for (let i = 23; i >= 0; i--) {
      const start = now - (i + 1) * 60 * 60 * 1000;
      const end = now - i * 60 * 60 * 1000;
      const count = evs.filter((e: any) => {
        const t = new Date(e.created_at).getTime();
        return t >= start && t < end;
      }).length;
      const label = new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      hourly.push({ hour: label, count });
    }

    // Quota / usage aggregates from search_usage.
    const { data: usageRows = [] } = await admin
      .from('search_usage')
      .select('search_count, total_tokens, last_search');
    const usage = usageRows || [];
    const totalSearches = usage.reduce((s: number, r: any) => s + (r.search_count || 0), 0);
    const totalTokens = usage.reduce((s: number, r: any) => s + Number(r.total_tokens || 0), 0);
    const uniqueClients = usage.length;
    const quotaSpikes24h = in24h.filter((e: any) => e.event_type === 'quota_drain_spike');
    const tokens24h = quotaSpikes24h.reduce(
      (s: number, e: any) => s + Number(e.metadata?.total || 0), 0,
    );

    // === ALERTS ===
    const alerts: { id: string; level: string; title: string; detail: string }[] = [];

    if (in1h.length >= TRAFFIC_SPIKE_PER_HOUR) {
      alerts.push({
        id: 'traffic-spike',
        level: 'high',
        title: 'Abnormal traffic spike',
        detail: `${in1h.length} security events in the last hour (threshold ${TRAFFIC_SPIKE_PER_HOUR}).`,
      });
    }
    for (const o of repeatOffenders.filter((o) => o.count >= REPEATED_BLOCK_THRESHOLD)) {
      alerts.push({
        id: `repeat-${o.ip_hash}`,
        level: 'high',
        title: 'Repeated blocked attempts',
        detail: `Client ${o.ip_hash.slice(0, 12)}… hit the limit ${o.count} times in 24h.`,
      });
    }
    if (tokens24h >= QUOTA_DRAIN_TOKENS_24H) {
      alerts.push({
        id: 'quota-drain',
        level: 'high',
        title: 'Quota-drain spike',
        detail: `${tokens24h.toLocaleString()} tokens flagged across ${quotaSpikes24h.length} spikes in 24h.`,
      });
    } else if (quotaSpikes24h.length > 0) {
      alerts.push({
        id: 'quota-spikes',
        level: 'medium',
        title: 'Token usage spikes detected',
        detail: `${quotaSpikes24h.length} high-token analyses in the last 24h.`,
      });
    }
    const untrusted24h = in24h.filter(
      (e: any) => e.event_type === 'untrusted_ip' || e.event_type === 'unidentifiable_client',
    ).length;
    if (untrusted24h >= 10) {
      alerts.push({
        id: 'untrusted',
        level: 'medium',
        title: 'Many untrusted clients',
        detail: `${untrusted24h} requests from spoofed/unidentifiable clients in 24h.`,
      });
    }

    return new Response(JSON.stringify({
      generatedAt: new Date().toISOString(),
      summary: {
        totalEvents: evs.length,
        events24h: in24h.length,
        events1h: in1h.length,
        totalSearches,
        totalTokens,
        uniqueClients,
        openAlerts: alerts.length,
      },
      byType,
      bySeverity,
      hourly,
      repeatOffenders,
      alerts,
      recentEvents: evs.slice(0, 100),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('security-dashboard error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
