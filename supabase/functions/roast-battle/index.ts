import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { player1, player2 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const p1 = player1, p2 = player2;

    const prompt = `You are a hilarious roast battle commentator for a GitHub developer showdown.

Player 1: @${p1.username}
- Overall Score: ${p1.analysis.scores?.overall?.score || 0}
- Stars: ${p1.analysis.totalStars || 0}, Forks: ${p1.analysis.totalForks || 0}
- Top Languages: ${Object.keys(p1.analysis.languages || {}).slice(0, 5).join(', ')}
- Repos: ${p1.userData.public_repos}, Followers: ${p1.userData.followers}
- Archetype: ${p1.analysis.archetype?.name || 'Unknown'}
- Streak: ${p1.analysis.currentStreak || 0} days

Player 2: @${p2.username}
- Overall Score: ${p2.analysis.scores?.overall?.score || 0}
- Stars: ${p2.analysis.totalStars || 0}, Forks: ${p2.analysis.totalForks || 0}
- Top Languages: ${Object.keys(p2.analysis.languages || {}).slice(0, 5).join(', ')}
- Repos: ${p2.userData.public_repos}, Followers: ${p2.userData.followers}
- Archetype: ${p2.analysis.archetype?.name || 'Unknown'}
- Streak: ${p2.analysis.currentStreak || 0} days

Return ONLY valid JSON (no markdown):
{
  "trashTalk": ["<6-8 alternating roast lines, odd indices from player1's perspective roasting player2, even indices from player2 roasting player1. Reference real stats. Be HILARIOUS.>"],
  "winner": "<username of the winner based on overall metrics>",
  "verdict": "<funny 1-2 sentence verdict explaining why the winner won>"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are the world's funniest developer roast battle MC. Generate hilarious, data-backed trash talk." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    let result;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
      if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
      if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
      const match = jsonStr.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : { trashTalk: [], winner: p1.username, verdict: 'Battle error' };
    } catch {
      result = { trashTalk: ["Couldn't parse the trash talk!"], winner: p1.username, verdict: 'Technical difficulties!' };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});