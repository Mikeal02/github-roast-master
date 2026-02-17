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
    const { user, repos, events = [], orgs = [], gists = [], starred = [], mode } = await req.json();
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
    const totalWatchers = repos.reduce((sum: number, r: any) => sum + (r.watchers_count || 0), 0);
    const reposWithReadme = repos.filter((r: any) => !r.fork && r.description).length;
    const forkedRepos = repos.filter((r: any) => r.fork).length;
    const originalRepos = repos.length - forkedRepos;
    const totalOpenIssues = repos.reduce((sum: number, r: any) => sum + (r.open_issues_count || 0), 0);
    
    const now = new Date();
    const repoActivity = repos.map((r: any) => {
      const updatedAt = new Date(r.updated_at);
      const daysSince = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
      return { name: r.name, daysSince, language: r.language, stars: r.stargazers_count, forks: r.forks_count, description: r.description };
    });
    
    const mostRecentUpdate = repoActivity.length > 0 ? Math.min(...repoActivity.map((r: any) => r.daysSince)) : 999;
    const inactiveRepos = repoActivity.filter((r: any) => r.daysSince > 180).length;
    const avgRepoAge = repoActivity.length > 0 ? repoActivity.reduce((s: number, r: any) => s + r.daysSince, 0) / repoActivity.length : 0;
    
    // Analyze events for activity patterns
    const eventTypes: Record<string, number> = {};
    const eventsByDay: Record<string, number> = {};
    const eventsByHour: number[] = new Array(24).fill(0);
    const eventsByDayOfWeek: number[] = new Array(7).fill(0);
    
    events.forEach((event: any) => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
      const date = new Date(event.created_at);
      const dateKey = date.toISOString().split('T')[0];
      eventsByDay[dateKey] = (eventsByDay[dateKey] || 0) + 1;
      eventsByHour[date.getHours()]++;
      eventsByDayOfWeek[date.getDay()]++;
    });
    
    const peakHour = eventsByHour.indexOf(Math.max(...eventsByHour));
    const peakHourLabel = peakHour >= 12 ? `${peakHour - 12 || 12}PM` : `${peakHour || 12}AM`;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakDay = dayNames[eventsByDayOfWeek.indexOf(Math.max(...eventsByDayOfWeek))];
    
    const activeDays = Object.keys(eventsByDay).length;
    const totalEvents = events.length;
    
    // Calculate streaks
    const sortedDates = Object.keys(eventsByDay).sort();
    let longestStreak = 0, currentStreak = 0, tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) tempStreak++;
      else { longestStreak = Math.max(longestStreak, tempStreak); tempStreak = 1; }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Check current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (eventsByDay[today] || eventsByDay[yesterday]) {
      let streak = 0;
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const d = new Date(sortedDates[i]);
        const expected = new Date(); expected.setDate(expected.getDate() - streak); expected.setHours(0,0,0,0); d.setHours(0,0,0,0);
        if (Math.abs(expected.getTime() - d.getTime()) / 86400000 <= 1) streak++;
        else break;
      }
      currentStreak = streak;
    }
    
    // Analyze organizations
    const orgNames = orgs.map((o: any) => o.login);
    
    // Analyze gists
    const publicGists = gists.length;
    const gistLanguages = gists.flatMap((g: any) => 
      Object.values(g.files || {}).map((f: any) => f.language).filter(Boolean)
    );
    
    // Collect repo topics
    const allTopics: string[] = repos.flatMap((r: any) => r.topics || []);
    const topicCounts: Record<string, number> = {};
    allTopics.forEach((t: string) => { topicCounts[t] = (topicCounts[t] || 0) + 1; });
    const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([t]) => t);
    
    // Starred repos analysis
    const starredLanguages = starred.map((r: any) => r.language).filter(Boolean);
    const starredLangCounts: Record<string, number> = {};
    starredLanguages.forEach((l: string) => { starredLangCounts[l] = (starredLangCounts[l] || 0) + 1; });
    
    // License analysis
    const licenses = repos.map((r: any) => r.license?.spdx_id).filter(Boolean);
    const licenseCounts: Record<string, number> = {};
    licenses.forEach((l: string) => { licenseCounts[l] = (licenseCounts[l] || 0) + 1; });
    
    // Commit message patterns from push events
    const commitMessages = events
      .filter((e: any) => e.type === 'PushEvent')
      .flatMap((e: any) => (e.payload?.commits || []).map((c: any) => c.message))
      .slice(0, 30);
    
    const avgCommitMsgLength = commitMessages.length > 0
      ? commitMessages.reduce((s: number, m: string) => s + m.length, 0) / commitMessages.length
      : 0;
    
    const githubSummary = {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      accountAge: Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)),
      totalStars,
      totalForks,
      totalWatchers,
      totalOpenIssues,
      languages: languageCounts,
      topLanguages: Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8),
      reposWithDescription: reposWithReadme,
      totalRepos: repos.length,
      originalRepos,
      forkedRepos,
      mostRecentUpdateDays: mostRecentUpdate,
      inactiveRepos,
      avgRepoAgeDays: Math.round(avgRepoAge),
      repoActivity: repoActivity.slice(0, 15),
      totalEvents,
      activeDaysLast90: activeDays,
      eventTypes,
      peakCodingHour: peakHourLabel,
      peakCodingDay: peakDay,
      currentStreak,
      longestStreak,
      organizations: orgNames,
      publicGists,
      gistLanguages: [...new Set(gistLanguages)],
      starredRepoInterests: Object.entries(starredLangCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
      topTopics,
      licenses: licenseCounts,
      commitMessagePatterns: {
        avgLength: Math.round(avgCommitMsgLength),
        sampleMessages: commitMessages.slice(0, 10),
      },
      hireable: user.hireable,
      twitterUsername: user.twitter_username,
      eventsByDayOfWeek: dayNames.map((d, i) => ({ day: d, count: eventsByDayOfWeek[i] })),
      eventsByHour: eventsByHour.map((c, h) => ({ hour: h, count: c })),
    };

    const systemPrompt = mode === 'recruiter' 
      ? `You are a senior tech recruiter AI performing comprehensive GitHub profile analysis. Provide deep, data-driven professional assessment suitable for hiring decisions. Be objective, thorough, and insightful about technical competency signals, collaboration patterns, and growth potential.`
      : `You are a legendary roast comedian AI with deep knowledge of software engineering. Generate devastatingly witty, data-backed roasts that are hilarious but insightful. Reference actual metrics, commit patterns, and coding habits. Think of yourself as the tech world's top comedian at a packed conference.`;

    const userPrompt = `Analyze this GitHub profile comprehensively and return a JSON response.

GitHub Profile Data:
${JSON.stringify(githubSummary, null, 2)}

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "scores": {
    "activity": { "score": <0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<data-backed reason>" },
    "documentation": { "score": <0-100>, "label": "<label>", "explanation": "<reason>" },
    "popularity": { "score": <0-100>, "label": "<label>", "explanation": "<reason>" },
    "diversity": { "score": <0-100>, "label": "<label>", "explanation": "<reason>" },
    "codeQuality": { "score": <0-100>, "label": "<label>", "explanation": "<reason based on commit messages, repo structure, topics>" },
    "collaboration": { "score": <0-100>, "label": "<label>", "explanation": "<reason based on orgs, PRs, issues, forks>" },
    "overall": { "score": <0-100>, "label": "<label>", "explanation": "<comprehensive assessment>" }
  },
  "archetype": {
    "name": "<creative developer archetype name>",
    "emoji": "<relevant emoji>",
    "description": "<2-3 sentence description>"
  },
  "activityStatus": {
    "label": "<descriptive activity label>",
    "daysSinceUpdate": <number>
  },
  "roastLines": ["<6-8 ${mode === 'recruiter' ? 'professional insights with specific data points' : 'devastatingly funny roast lines referencing actual data'}>"],
  "recruiterMetric": {
    "name": "Overall Readiness",
    "value": <percentage>,
    "grade": "<A/B/C/D/F>",
    "explanation": "<detailed hiring assessment>"
  },
  "personality": {
    "focusType": "<Deep Work / Short Bursts / Scattered / etc>",
    "procrastinationTendency": <0-100>,
    "burnoutRisk": <0-100>,
    "learningStyle": "<Project-Based / Tutorial-Driven / Self-Taught / etc>",
    "personalityType": {
      "type": "<creative coding personality name>",
      "emoji": "<emoji>",
      "description": "<2-3 sentences>"
    },
    "peakActivityDay": "<weekday>",
    "metrics": {
      "consistency": <0-100>,
      "exploration": <0-100>,
      "collaboration": <0-100>,
      "documentation": <0-100>
    },
    "funInsights": ["<5-7 deeply specific, data-backed insights about their coding patterns>"],
    "suggestions": ["<3-5 actionable improvement suggestions>"]
  },
  "techAnalysis": {
    "primaryDomain": "<Frontend/Backend/Full-Stack/DevOps/Data Science/Mobile/Systems>",
    "seniorityEstimate": "<Junior/Mid/Senior/Staff/Principal>",
    "strengthAreas": ["<3-4 specific technical strengths>"],
    "growthAreas": ["<2-3 areas for improvement>"],
    "projectComplexityScore": <0-100>,
    "commitQualityScore": <0-100>,
    "openSourceEngagement": "<Low/Medium/High/Very High>"
  },
  "careerInsights": {
    "idealRoles": ["<3-4 job titles that would be a good fit>"],
    "teamFit": "<Solo Warrior / Small Team / Large Enterprise / Open Source Community>",
    "workStyle": "<description of their work patterns and style>",
    "growthTrajectory": "<Rising Star / Steady Contributor / Plateaued / Declining>"
  }
}

${mode === 'recruiter' 
  ? 'Professional tone. Focus on strengths and actionable growth areas. No jokes.'
  : 'Make roasts HILARIOUS and specific. Reference commit messages, peak hours, language choices. Be creative!'}

IMPORTANT: Return ONLY the JSON object.`;

    console.log('Calling AI gateway for comprehensive analysis...');
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    console.log('AI response received, length:', content?.length);

    let analysisResult;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
      if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
      if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
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

    // Augment with computed data
    analysisResult.languages = languageCounts;
    analysisResult.totalStars = totalStars;
    analysisResult.totalForks = totalForks;
    analysisResult.totalWatchers = totalWatchers;
    analysisResult.currentStreak = currentStreak;
    analysisResult.longestStreak = longestStreak;
    analysisResult.activeDays = activeDays;
    analysisResult.totalEvents = totalEvents;
    analysisResult.peakCodingHour = peakHourLabel;
    analysisResult.peakCodingDay = peakDay;
    analysisResult.topTopics = topTopics;
    analysisResult.originalRepos = originalRepos;
    analysisResult.forkedRepos = forkedRepos;
    
    // Top repositories with full data for deep dive
    const topRepos = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 10)
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language,
        url: r.html_url,
        full_name: r.full_name,
        owner: { login: r.owner?.login || user.login },
        open_issues_count: r.open_issues_count || 0,
        size: r.size || 0,
        created_at: r.created_at,
        updated_at: r.updated_at,
        topics: r.topics || [],
        license: r.license,
        watchers_count: r.watchers_count || 0,
      }));
    analysisResult.topRepositories = topRepos;

    console.log('Comprehensive analysis complete for:', user.login);
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
