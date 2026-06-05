import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Activity, Ban, Zap, Users, Lock, RefreshCw,
  ArrowLeft, Fingerprint, TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOwnerKey } from '@/hooks/useOwnerKey';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { toast } from 'sonner';

interface DashboardData {
  generatedAt: string;
  summary: {
    totalEvents: number; events24h: number; events1h: number;
    totalSearches: number; totalTokens: number; uniqueClients: number; openAlerts: number;
  };
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  hourly: { hour: string; count: number }[];
  repeatOffenders: { ip_hash: string; count: number }[];
  alerts: { id: string; level: string; title: string; detail: string }[];
  recentEvents: any[];
}

const severityColor = (s: string) =>
  s === 'high' || s === 'critical' ? 'text-terminal-red border-terminal-red/30 bg-terminal-red/10'
  : s === 'medium' ? 'text-terminal-yellow border-terminal-yellow/30 bg-terminal-yellow/10'
  : 'text-terminal-cyan border-terminal-cyan/30 bg-terminal-cyan/10';

const eventLabel: Record<string, string> = {
  limit_blocked: 'Blocked attempt',
  untrusted_ip: 'Untrusted IP',
  unidentifiable_client: 'Unidentifiable client',
  quota_drain_spike: 'Quota-drain spike',
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: string }) => (
  <div className="glass-panel p-4 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${accent || 'bg-primary/10 text-primary'}`}>{icon}</div>
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default function SecurityDashboard() {
  const { ownerKey, setOwnerKey, hasOwnerKey } = useOwnerKey();
  const [passInput, setPassInput] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async (key: string) => {
    if (!key) return;
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke('security-dashboard', {
        body: { ownerKey: key },
      });
      if (error || res?.error) {
        const ctx = (error as any)?.context;
        let parsed: any = null;
        try { if (ctx?.json) parsed = await ctx.json(); } catch { /* ignore */ }
        const status = parsed?.error || res?.error;
        if (status === 'Unauthorized') {
          toast.error('Invalid owner passcode');
          setAuthed(false);
          setOwnerKey('');
          return;
        }
        throw new Error(status || error?.message || 'Failed to load');
      }
      setData(res);
      setAuthed(true);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load security data');
    } finally {
      setLoading(false);
    }
  }, [setOwnerKey]);

  useEffect(() => {
    if (hasOwnerKey) load(ownerKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput.trim()) return;
    setOwnerKey(passInput.trim());
    load(passInput.trim());
  };

  // ---- Locked / login view ----
  if (!authed) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 w-full max-w-sm text-center relative z-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">Security Dashboard</h1>
          <p className="text-sm text-muted-foreground mb-6">Owner access only. Enter your passcode.</p>
          <form onSubmit={handleUnlock} className="space-y-3">
            <Input
              type="password" placeholder="Owner passcode" value={passInput}
              onChange={(e) => setPassInput(e.target.value)} autoFocus
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying…' : 'Unlock'}
            </Button>
          </form>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-6">
            <ArrowLeft className="w-3 h-3" /> Back to app
          </Link>
        </motion.div>
      </div>
    );
  }

  const maxHourly = data ? Math.max(1, ...data.hourly.map((h) => h.count)) : 1;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary"><Shield className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Security Monitoring</h1>
              <p className="text-xs text-muted-foreground">
                {data ? `Updated ${new Date(data.generatedAt).toLocaleTimeString()}` : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => load(ownerKey)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="w-4 h-4 mr-1.5" /> App</Link></Button>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {data && data.alerts.length === 0 && (
            <div className="glass-panel p-4 flex items-center gap-3 border border-terminal-green/30">
              <Shield className="w-5 h-5 text-terminal-green" />
              <p className="text-sm text-foreground">All clear — no active alerts.</p>
            </div>
          )}
          {data?.alerts.map((a) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className={`glass-panel p-4 flex items-start gap-3 border ${severityColor(a.level)}`}>
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary stats */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Open alerts" value={data.summary.openAlerts}
              accent={data.summary.openAlerts > 0 ? 'bg-terminal-red/10 text-terminal-red' : 'bg-terminal-green/10 text-terminal-green'} />
            <StatCard icon={<Activity className="w-5 h-5" />} label="Events (24h)" value={data.summary.events24h} />
            <StatCard icon={<Ban className="w-5 h-5" />} label="Events (1h)" value={data.summary.events1h}
              accent="bg-terminal-yellow/10 text-terminal-yellow" />
            <StatCard icon={<Users className="w-5 h-5" />} label="Unique clients" value={data.summary.uniqueClients} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total searches" value={data.summary.totalSearches}
              accent="bg-terminal-cyan/10 text-terminal-cyan" />
            <StatCard icon={<Zap className="w-5 h-5" />} label="Total tokens" value={data.summary.totalTokens.toLocaleString()}
              accent="bg-accent/10 text-accent" />
            <StatCard icon={<Shield className="w-5 h-5" />} label="Events (7d)" value={data.summary.totalEvents} />
            <StatCard icon={<Fingerprint className="w-5 h-5" />} label="Repeat offenders" value={data.repeatOffenders.length}
              accent="bg-terminal-purple/10 text-terminal-purple" />
          </div>
        )}

        {/* Hourly traffic */}
        {data && (
          <div className="glass-panel p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Event volume (last 24h)
            </h3>
            <div className="flex items-end gap-1 h-32">
              {data.hourly.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="w-full rounded-t bg-gradient-to-t from-primary/40 to-primary transition-all"
                    style={{ height: `${(h.count / maxHourly) * 100}%`, minHeight: h.count > 0 ? '4px' : '0' }}
                    title={`${h.hour}: ${h.count}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Event breakdown */}
          {data && (
            <div className="glass-panel p-5">
              <h3 className="font-semibold text-foreground mb-4">Event breakdown (7d)</h3>
              <div className="space-y-2">
                {Object.entries(data.byType).length === 0 && (
                  <p className="text-sm text-muted-foreground">No events recorded yet.</p>
                )}
                {Object.entries(data.byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{eventLabel[type] || type}</span>
                    <span className="font-mono text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Repeat offenders */}
          {data && (
            <div className="glass-panel p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Ban className="w-4 h-4 text-terminal-red" /> Repeat offenders (24h)
              </h3>
              <div className="space-y-2">
                {data.repeatOffenders.length === 0 && (
                  <p className="text-sm text-muted-foreground">No repeated blocked attempts.</p>
                )}
                {data.repeatOffenders.map((o) => (
                  <div key={o.ip_hash} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{o.ip_hash.slice(0, 16)}…</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${o.count >= 5 ? severityColor('high') : severityColor('medium')}`}>
                      {o.count} blocks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent events */}
        {data && (
          <div className="glass-panel p-5">
            <h3 className="font-semibold text-foreground mb-4">Recent events</h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {data.recentEvents.length === 0 && (
                <p className="text-sm text-muted-foreground">No events recorded yet.</p>
              )}
              {data.recentEvents.map((e) => (
                <div key={e.id} className="flex items-start gap-3 text-xs p-2 rounded-lg bg-muted/20">
                  <span className={`px-1.5 py-0.5 rounded border shrink-0 ${severityColor(e.severity)}`}>{e.severity}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground font-medium">{eventLabel[e.event_type] || e.event_type}</p>
                    <p className="text-muted-foreground truncate">{e.detail}</p>
                  </div>
                  <span className="text-muted-foreground shrink-0">{new Date(e.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
