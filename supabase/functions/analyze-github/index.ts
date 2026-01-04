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
    const { user, repos, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing GitHub profile for:', user.login, 'Mode:', mode);

    // Prepare GitHub data summary for AI
    const repoLanguages = repos.map((r: any) => r.language).filter(Boolean);
    const languageCounts: Record<string, number> = {};
    repoLanguages.forEach((lang: string) => {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
    
    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);
    const reposWithReadme = repos.filter((r: any) => !r.fork && r.description).length;
    
    const now = new Date();
    const repoActivity = repos.map((r: any) => {
      const updatedAt = new Date(r.updated_at);
      const daysSince = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
      return { name: r.name, daysSince, language: r.language, stars: r.stargazers_count };
    });
    
    const mostRecentUpdate = repoActivity.length > 0 ? Math.min(...repoActivity.map((r: any) => r.daysSince)) : 999;
    const inactiveRepos = repoActivity.filter((r: any) => r.daysSince > 180).length;
     // added ai api keys
    const githubSummary = {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      accountAge: Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)),
      totalStars,
      totalForks,
      languages: languageCounts,
      topLanguages: Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
      reposWithDescription: reposWithReadme,
      totalRepos: repos.length,
      mostRecentUpdateDays: mostRecentUpdate,
      inactiveRepos,
      repoActivity: repoActivity.slice(0, 10),
    };

    const systemPrompt = mode === 'recruiter' 
      ? `You are a professional tech recruiter AI analyzing GitHub profiles. Provide insightful, professional analysis suitable for hiring decisions. Be objective, highlight strengths and areas for growth. Focus on technical competency signals.`
      : `You are a hilarious roast comedian AI that analyzes GitHub profiles. Generate witty, clever, data-backed roasts that are funny but not mean-spirited. Reference actual metrics in your jokes. Think of yourself as a friendly comedian at a tech conference.`;

    const userPrompt = `Analyze this GitHub profile and return a JSON response.

GitHub Profile Data:
${JSON.stringify(githubSummary, null, 2)}

Return ONLY valid JSON (no markdown, no code blocks, just pure JSON) with this exact structure:
{
  "scores": {
    "activity": { "score": <number 0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<data-backed reason>" },
    "documentation": { "score": <number 0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<data-backed reason>" },
    "popularity": { "score": <number 0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<data-backed reason>" },
    "diversity": { "score": <number 0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<data-backed reason>" },
    "overall": { "score": <number 0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<overall assessment>" }
  },
  "archetype": {
    "name": "<creative developer archetype name>",
    "emoji": "<relevant emoji>",
    "description": "<2-3 sentence description of this archetype>"
  },
  "activityStatus": {
    "label": "<time-based label like 'Active within last 7 days' or 'No activity in 3 months'>",
    "daysSinceUpdate": <number>
  },
  "roastLines": ["<array of 4-6 ${mode === 'recruiter' ? 'professional insights' : 'funny roast lines'} that reference actual data>"],
  "recruiterMetric": {
    "name": "Documentation Coverage",
    "value": <percentage number>,
    "grade": "<A/B/C/D/F>",
    "explanation": "<what this means for hiring>"
  },
  "personality": {
    "focusType": "<Deep Work / Short Bursts / Scattered / etc>",
    "procrastinationTendency": <number 0-100>,
    "burnoutRisk": <number 0-100>,
    "learningStyle": "<Project-Based / Tutorial-Driven / Self-Taught / etc>",
    "personalityType": {
      "type": "<creative name for their coding personality>",
      "emoji": "<relevant emoji>",
      "description": "<2-3 sentence description>"
    },
    "peakActivityDay": "<weekday name>",
    "metrics": {
      "consistency": <number 0-100>,
      "exploration": <number 0-100>,
      "collaboration": <number 0-100>,
      "documentation": <number 0-100>
    },
    "funInsights": ["<3-5 engaging, slightly 'creepy but educational' insights about their coding patterns based on actual data>"],
    "suggestions": ["<2-4 practical, actionable suggestions for improvement based on their patterns>"]
  }
}

Score Guidelines:
- 0-20 = Critical (very poor)
- 21-40 = Weak (below average)
- 41-60 = Decent (average)
- 61-80 = Strong (above average)
- 81-100 = Elite (exceptional)

${mode === 'recruiter' 
  ? 'Keep all language professional and suitable for HR/hiring contexts. Focus on strengths and growth areas. No jokes.'
  : 'Make the roast lines funny, clever, and reference actual metrics. Be witty but not cruel. Include self-deprecating humor about developers.'}

IMPORTANT: Return ONLY the JSON object, no other text.`;

    console.log('Calling AI gateway for GitHub analysis...');
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    console.log('AI response received, length:', content?.length);

    // Parse JSON from AI response
    let analysisResult;
    try {
      // Try to extract JSON from the response (handles markdown code blocks if present)
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();
      
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content:', content?.substring(0, 500));
      throw new Error('Failed to parse AI analysis');
    }

    // Add language data for the chart
    analysisResult.languages = languageCounts;
    
    // Add total stars and forks for achievements
    analysisResult.totalStars = totalStars;
    analysisResult.totalForks = totalForks;
    
    // Add top repositories
    const topRepos = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 5)
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language,
        url: r.html_url,
      }));
    analysisResult.topRepositories = topRepos;

    console.log('Analysis complete for:', user.login);
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in analyze-github function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
