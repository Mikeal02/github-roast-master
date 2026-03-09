import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, repos, events = [], orgs = [], gists = [], starred = [], mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GITHUB_API_KEY = Deno.env.get('GITHUB_API_KEY');
    
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    console.log('Analyzing GitHub profile for:', user.login, 'Mode:', mode);

    // === LANGUAGE ANALYSIS ===
    const repoLanguages = repos.map((r: any) => r.language).filter(Boolean);
    const languageCounts: Record<string, number> = {};
    repoLanguages.forEach((lang: string) => { languageCounts[lang] = (languageCounts[lang] || 0) + 1; });
    
    // === CORE REPO METRICS ===
    const totalStars = repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s: number, r: any) => s + (r.forks_count || 0), 0);
    const totalWatchers = repos.reduce((s: number, r: any) => s + (r.watchers_count || 0), 0);
    const totalOpenIssues = repos.reduce((s: number, r: any) => s + (r.open_issues_count || 0), 0);
    const forkedRepos = repos.filter((r: any) => r.fork).length;
    const originalRepos = repos.length - forkedRepos;
    const reposWithDescription = repos.filter((r: any) => r.description).length;
    const reposWithLicense = repos.filter((r: any) => r.license).length;
    const reposWithTopics = repos.filter((r: any) => r.topics?.length > 0).length;
    const reposWithHomepage = repos.filter((r: any) => r.homepage).length;
    const archivedRepos = repos.filter((r: any) => r.archived).length;
    
    const totalRepoSize = repos.reduce((s: number, r: any) => s + (r.size || 0), 0);
    const avgRepoSize = repos.length > 0 ? totalRepoSize / repos.length : 0;
    const forkToStarRatio = totalStars > 0 ? +(totalForks / totalStars).toFixed(2) : 0;
    const avgStarsPerRepo = repos.length > 0 ? +(totalStars / repos.length).toFixed(1) : 0;

    const now = new Date();
    
    // Median stars
    const medianStars = (() => {
      const sorted = repos.map((r: any) => r.stargazers_count || 0).sort((a: number, b: number) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length ? (sorted.length % 2 ? sorted[mid] : +((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1)) : 0;
    })();

    // === REPO ACTIVITY TIMELINE ===
    const repoActivity = repos.map((r: any) => {
      const daysSince = Math.floor((now.getTime() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24));
      return { 
        name: r.name, daysSince, language: r.language, stars: r.stargazers_count, forks: r.forks_count, 
        description: r.description, size: r.size || 0, created_at: r.created_at, updated_at: r.updated_at,
        open_issues: r.open_issues_count || 0, topics: r.topics || [], hasLicense: !!r.license,
      };
    });
    
    const mostRecentUpdate = repoActivity.length > 0 ? Math.min(...repoActivity.map((r: any) => r.daysSince)) : 999;
    const inactiveRepos = repoActivity.filter((r: any) => r.daysSince > 180).length;

    // === LANGUAGE EVOLUTION ===
    const languagesByYear: Record<number, Record<string, number>> = {};
    repos.forEach((r: any) => {
      const y = new Date(r.created_at).getFullYear();
      if (!languagesByYear[y]) languagesByYear[y] = {};
      if (r.language) languagesByYear[y][r.language] = (languagesByYear[y][r.language] || 0) + 1;
    });

    // === SIZE DISTRIBUTION ===
    const sizeDistribution = {
      tiny: repos.filter((r: any) => (r.size || 0) < 100).length,
      small: repos.filter((r: any) => (r.size || 0) >= 100 && (r.size || 0) < 1000).length,
      medium: repos.filter((r: any) => (r.size || 0) >= 1000 && (r.size || 0) < 10000).length,
      large: repos.filter((r: any) => (r.size || 0) >= 10000).length,
    };

    // === EVENT ANALYSIS ===
    const eventTypes: Record<string, number> = {};
    const eventsByDay: Record<string, number> = {};
    const eventsByHour: number[] = new Array(24).fill(0);
    const eventsByDayOfWeek: number[] = new Array(7).fill(0);
    const eventsByMonth: number[] = new Array(12).fill(0);
    
    events.forEach((event: any) => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
      const date = new Date(event.created_at);
      eventsByDay[date.toISOString().split('T')[0]] = (eventsByDay[date.toISOString().split('T')[0]] || 0) + 1;
      eventsByHour[date.getHours()]++;
      eventsByDayOfWeek[date.getDay()]++;
      eventsByMonth[date.getMonth()]++;
    });
    
    const peakHour = eventsByHour.indexOf(Math.max(...eventsByHour));
    const peakHourLabel = peakHour >= 12 ? `${peakHour - 12 || 12}PM` : `${peakHour || 12}AM`;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakDay = dayNames[eventsByDayOfWeek.indexOf(Math.max(...eventsByDayOfWeek))];
    
    const activeDays = Object.keys(eventsByDay).length;
    const totalEvents = events.length;
    const weekendEvents = eventsByDayOfWeek[0] + eventsByDayOfWeek[6];
    const weekendRatio = totalEvents > 0 ? +(weekendEvents / totalEvents * 100).toFixed(1) : 0;
    const eventsPerActiveDay = activeDays > 0 ? +(totalEvents / activeDays).toFixed(1) : 0;

    // === ADVANCED EVENT METRICS ===
    const lateNightEvents = eventsByHour.slice(22).reduce((a, b) => a + b, 0) + eventsByHour.slice(0, 5).reduce((a, b) => a + b, 0);
    const lateNightRatio = totalEvents > 0 ? +(lateNightEvents / totalEvents * 100).toFixed(1) : 0;
    
    // Burst analysis: find max events in a single day
    const maxDailyEvents = Object.values(eventsByDay).length > 0 ? Math.max(...Object.values(eventsByDay)) : 0;
    
    // Activity consistency (coefficient of variation of daily events)
    const dailyValues = Object.values(eventsByDay);
    const avgDaily = dailyValues.length > 0 ? dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length : 0;
    const stdDev = dailyValues.length > 0 ? Math.sqrt(dailyValues.reduce((sum, v) => sum + (v - avgDaily) ** 2, 0) / dailyValues.length) : 0;
    const consistencyScore = avgDaily > 0 ? Math.max(0, Math.min(100, Math.round(100 - (stdDev / avgDaily) * 50))) : 0;

    // Event type breakdown
    const eventTypeBreakdown = Object.entries(eventTypes)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type: type.replace('Event', ''), count, percentage: +(count / totalEvents * 100).toFixed(1) }));
    
    // === STREAKS ===
    const sortedDates = Object.keys(eventsByDay).sort();
    let longestStreak = 0, currentStreak = 0, tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) tempStreak++;
      else { longestStreak = Math.max(longestStreak, tempStreak); tempStreak = 1; }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
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

    // === ORG / GIST / TOPIC ANALYSIS ===
    const orgNames = orgs.map((o: any) => o.login);
    const publicGists = gists.length;
    const gistLanguages = gists.flatMap((g: any) => Object.values(g.files || {}).map((f: any) => f.language).filter(Boolean));
    
    const allTopics: string[] = repos.flatMap((r: any) => r.topics || []);
    const topicCounts: Record<string, number> = {};
    allTopics.forEach((t: string) => { topicCounts[t] = (topicCounts[t] || 0) + 1; });
    const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([t]) => t);
    
    const starredLanguages = starred.map((r: any) => r.language).filter(Boolean);
    const starredLangCounts: Record<string, number> = {};
    starredLanguages.forEach((l: string) => { starredLangCounts[l] = (starredLangCounts[l] || 0) + 1; });
    
    const licenses = repos.map((r: any) => r.license?.spdx_id).filter(Boolean);
    const licenseCounts: Record<string, number> = {};
    licenses.forEach((l: string) => { licenseCounts[l] = (licenseCounts[l] || 0) + 1; });

    // === COMMIT MESSAGE ANALYSIS ===
    const commitMessages = events
      .filter((e: any) => e.type === 'PushEvent')
      .flatMap((e: any) => (e.payload?.commits || []).map((c: any) => c.message))
      .slice(0, 50);
    
    const avgCommitMsgLength = commitMessages.length > 0
      ? commitMessages.reduce((s: number, m: string) => s + m.length, 0) / commitMessages.length : 0;
    
    const conventionalCommits = commitMessages.filter((m: string) => /^(feat|fix|chore|docs|style|refactor|test|build|ci|perf|revert)(\(.+\))?:/.test(m)).length;
    const conventionalCommitRatio = commitMessages.length > 0 ? +(conventionalCommits / commitMessages.length * 100).toFixed(1) : 0;
    
    // Commit message quality heuristics
    const shortCommits = commitMessages.filter((m: string) => m.length < 10).length;
    const longCommits = commitMessages.filter((m: string) => m.length > 72).length;
    const mergeCommits = commitMessages.filter((m: string) => m.startsWith('Merge')).length;
    const fixCommits = commitMessages.filter((m: string) => /fix|bug|patch|hotfix/i.test(m)).length;
    const featCommits = commitMessages.filter((m: string) => /feat|add|implement|new/i.test(m)).length;
    const wipCommits = commitMessages.filter((m: string) => /^wip|^WIP|work.in.progress|temp|todo/i.test(m)).length;

    // === PR / ISSUE ANALYSIS FROM EVENTS ===
    const prEvents = events.filter((e: any) => e.type === 'PullRequestEvent');
    const issueEvents = events.filter((e: any) => e.type === 'IssuesEvent');
    const prReviewEvents = events.filter((e: any) => e.type === 'PullRequestReviewEvent');
    const createEvents = events.filter((e: any) => e.type === 'CreateEvent');
    const deleteEvents = events.filter((e: any) => e.type === 'DeleteEvent');
    const releaseEvents = events.filter((e: any) => e.type === 'ReleaseEvent');
    const forkEvents = events.filter((e: any) => e.type === 'ForkEvent');
    
    // Unique repos contributed to
    const uniqueReposContributed = new Set(events.map((e: any) => e.repo?.name).filter(Boolean)).size;

    // === NETWORK ANALYSIS ===
    const followRatio = user.following > 0 ? +(user.followers / user.following).toFixed(2) : user.followers;
    const accountAgeDays = Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const accountAgeYears = +(accountAgeDays / 365).toFixed(1);
    const reposPerYear = accountAgeYears > 0 ? +(user.public_repos / accountAgeYears).toFixed(1) : user.public_repos;
    const starsPerYear = accountAgeYears > 0 ? +(totalStars / accountAgeYears).toFixed(1) : totalStars;
    const followersPerYear = accountAgeYears > 0 ? +(user.followers / accountAgeYears).toFixed(1) : user.followers;

    // === COMPREHENSIVE GITHUB SUMMARY ===
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
      followRatio,
      accountAgeYears,
      accountAgeDays,
      totalStars,
      totalForks,
      totalWatchers,
      totalOpenIssues,
      languages: languageCounts,
      topLanguages: Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
      reposWithDescription,
      totalRepos: repos.length,
      originalRepos,
      forkedRepos,
      archivedRepos,
      reposWithHomepage,
      mostRecentUpdateDays: mostRecentUpdate,
      inactiveRepos,
      repoActivity: repoActivity.slice(0, 20),
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
      starredRepoInterests: Object.entries(starredLangCounts).sort((a, b) => b[1] - a[1]).slice(0, 8),
      topTopics,
      licenses: licenseCounts,
      commitMessagePatterns: {
        avgLength: Math.round(avgCommitMsgLength),
        sampleMessages: commitMessages.slice(0, 15),
        conventionalCommitRatio,
        shortCommitPercent: commitMessages.length > 0 ? +(shortCommits / commitMessages.length * 100).toFixed(1) : 0,
        mergeCommitPercent: commitMessages.length > 0 ? +(mergeCommits / commitMessages.length * 100).toFixed(1) : 0,
        wipCommitPercent: commitMessages.length > 0 ? +(wipCommits / commitMessages.length * 100).toFixed(1) : 0,
        fixToFeatRatio: featCommits > 0 ? +(fixCommits / featCommits).toFixed(2) : fixCommits,
      },
      hireable: user.hireable,
      twitterUsername: user.twitter_username,
      eventsByDayOfWeek: dayNames.map((d, i) => ({ day: d, count: eventsByDayOfWeek[i] })),
      eventsByHour: eventsByHour.map((c, h) => ({ hour: h, count: c })),
      avgStarsPerRepo,
      medianStars,
      forkToStarRatio,
      avgRepoSizeKB: Math.round(avgRepoSize),
      totalRepoSizeMB: Math.round(totalRepoSize / 1024),
      sizeDistribution,
      reposWithLicense,
      reposWithTopics,
      weekendRatio,
      eventsPerActiveDay,
      eventTypeBreakdown,
      languagesByYear,
      // NEW deep metrics
      lateNightRatio,
      maxDailyEvents,
      consistencyScore,
      reposPerYear,
      starsPerYear,
      followersPerYear,
      prCount: prEvents.length,
      issueCount: issueEvents.length,
      prReviewCount: prReviewEvents.length,
      releaseCount: releaseEvents.length,
      forkEventCount: forkEvents.length,
      uniqueReposContributed,
      commitAnalysis: {
        total: commitMessages.length,
        conventional: conventionalCommits,
        short: shortCommits,
        long: longCommits,
        merges: mergeCommits,
        fixes: fixCommits,
        features: featCommits,
        wip: wipCommits,
      },
    };

    const systemPrompt = mode === 'recruiter' 
      ? `You are a senior tech recruiter AI with 15+ years of experience performing the most comprehensive GitHub profile analysis in the industry. Provide deep, data-driven professional assessment suitable for VP-level hiring decisions. Be objective, thorough, and insightful about technical competency signals, collaboration patterns, growth trajectory, and leadership potential. Cross-reference all metrics for accuracy.`
      : `You are a legendary roast comedian AI who's also a principal engineer at a FAANG company. You generate devastatingly witty, technically-accurate roasts that are hilarious but deeply insightful. Your roasts reference actual metrics, commit patterns, language choices, and coding habits with surgical precision. Think of yourself as the tech world's top comedian performing to a packed audience of senior engineers who WILL catch any inaccuracies.`;

    const userPrompt = `Analyze this GitHub profile with MAXIMUM analytical depth and return a JSON response.

GitHub Profile Data:
${JSON.stringify(githubSummary, null, 2)}

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "scores": {
    "activity": { "score": <0-100>, "label": "<Critical/Weak/Decent/Strong/Elite>", "explanation": "<data-backed reason citing specific numbers>", "subMetrics": { "recentActivity": <0-100>, "consistency": <0-100>, "eventDiversity": <0-100>, "streakStrength": <0-100> } },
    "documentation": { "score": <0-100>, "label": "<label>", "explanation": "<reason with %s>", "subMetrics": { "readmeQuality": <0-100>, "descriptions": <0-100>, "licensing": <0-100>, "topicTagging": <0-100> } },
    "popularity": { "score": <0-100>, "label": "<label>", "explanation": "<reason>", "subMetrics": { "starGrowth": <0-100>, "forkEngagement": <0-100>, "communitySize": <0-100>, "influenceRatio": <0-100> } },
    "diversity": { "score": <0-100>, "label": "<label>", "explanation": "<reason>", "subMetrics": { "languageBreadth": <0-100>, "domainRange": <0-100>, "topicVariety": <0-100>, "techEvolution": <0-100> } },
    "codeQuality": { "score": <0-100>, "label": "<label>", "explanation": "<reason based on commit analysis>", "subMetrics": { "commitMessages": <0-100>, "projectStructure": <0-100>, "bestPractices": <0-100>, "conventionalCommits": <0-100> } },
    "collaboration": { "score": <0-100>, "label": "<label>", "explanation": "<reason>", "subMetrics": { "teamwork": <0-100>, "openSource": <0-100>, "mentoring": <0-100>, "codeReview": <0-100> } },
    "overall": { "score": <0-100>, "label": "<label>", "explanation": "<comprehensive 2-sentence assessment>" }
  },
  "archetype": {
    "name": "<creative developer archetype name>",
    "emoji": "<relevant emoji>",
    "description": "<2-3 vivid sentences>"
  },
  "activityStatus": {
    "label": "<descriptive activity label>",
    "daysSinceUpdate": <number>
  },
  "roastLines": ["<8-10 ${mode === 'recruiter' ? 'professional insights with specific data points and percentages' : 'devastatingly funny roast lines referencing actual data — each must cite a specific metric'}>"],
  "recruiterMetric": {
    "name": "Overall Readiness",
    "value": <percentage>,
    "grade": "<A+/A/A-/B+/B/B-/C+/C/D/F>",
    "explanation": "<detailed 2-sentence hiring assessment>",
    "redFlags": ["<0-3 concerns if any>"],
    "greenFlags": ["<2-4 positive signals>"]
  },
  "personality": {
    "focusType": "<Deep Work / Short Bursts / Scattered / Marathon Coder / Night Owl Architect>",
    "procrastinationTendency": <0-100>,
    "burnoutRisk": <0-100>,
    "learningStyle": "<Project-Based / Tutorial-Driven / Self-Taught / Community-Driven / Academic>",
    "personalityType": {
      "type": "<creative coding personality name>",
      "emoji": "<emoji>",
      "description": "<2-3 vivid sentences>"
    },
    "peakActivityDay": "<weekday>",
    "codingPersona": "<The Architect / The Firefighter / The Explorer / The Perfectionist / The Shipper / The Night Owl / The Weekend Warrior>",
    "metrics": {
      "consistency": <0-100>,
      "exploration": <0-100>,
      "collaboration": <0-100>,
      "documentation": <0-100>,
      "ambition": <0-100>,
      "discipline": <0-100>
    },
    "funInsights": ["<6-8 deeply specific, data-backed insights about their coding patterns — each MUST reference a real number>"],
    "suggestions": ["<4-6 actionable improvement suggestions with expected impact>"]
  },
  "techAnalysis": {
    "primaryDomain": "<Frontend/Backend/Full-Stack/DevOps/Data Science/Mobile/Systems/Blockchain/AI-ML>",
    "seniorityEstimate": "<Junior/Mid/Senior/Staff/Principal/Distinguished>",
    "strengthAreas": ["<4-5 specific technical strengths>"],
    "growthAreas": ["<3-4 areas for improvement with specific suggestions>"],
    "projectComplexityScore": <0-100>,
    "commitQualityScore": <0-100>,
    "openSourceEngagement": "<Low/Medium/High/Very High/Legendary>",
    "techTrend": "<description of how their tech choices have evolved>",
    "architectureStyle": "<Monolith Builder / Microservices Fan / Script Kiddie / Library Author / Framework Consumer / Full-Stack Architect / DevOps Engineer / Data Pipeline Builder>",
    "codeMaturitySignals": ["<2-3 specific signals of code maturity or immaturity>"],
    "toolchainInsight": "<analysis of their preferred tools, frameworks, CI/CD patterns>"
  },
  "careerInsights": {
    "idealRoles": ["<4-5 specific job titles>"],
    "teamFit": "<Solo Warrior / Small Team / Large Enterprise / Open Source Community / Startup CTO / Tech Lead>",
    "workStyle": "<2-sentence description>",
    "growthTrajectory": "<Rising Star / Steady Contributor / Plateaued / Declining / Explosive Growth / Late Bloomer>",
    "salaryTier": "<Entry / Mid-Market / Senior / Staff+ / Distinguished / C-Suite>",
    "industryFit": ["<3-4 industries>"],
    "leadershipPotential": "<Low / Moderate / High / Already Leading>",
    "remoteReadiness": "<assessment based on async patterns>"
  },
  "healthMetrics": {
    "workLifeBalance": <0-100>,
    "weekendCodingPercent": ${weekendRatio},
    "lateNightCodingPercent": ${lateNightRatio},
    "sustainabilityScore": <0-100>,
    "diversificationIndex": <0-100>,
    "burnoutWarnings": ["<0-2 specific warnings if detected>"]
  },
  "impactMetrics": {
    "communityImpact": <0-100>,
    "knowledgeSharing": <0-100>,
    "innovationIndex": <0-100>,
    "reliabilityScore": <0-100>,
    "velocityTrend": "<Accelerating / Steady / Decelerating / Sporadic>"
  }
}

${mode === 'recruiter' 
  ? 'Professional tone. Every score must be justified with specific data. Include red/green flags. Focus on hiring signals.'
  : 'Make roasts HILARIOUS, specific, and technically accurate. Each roast MUST cite an actual metric. Be creative with analogies and pop culture references!'}

CRITICAL: Return ONLY the JSON object. No markdown wrapping. Every score explanation must cite actual numbers from the data.`;

    console.log('Calling AI gateway for elite analysis...');
    
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
        temperature: mode === 'recruiter' ? 0.6 : 0.85,
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

    if (!content || content.trim().length === 0) {
      console.error('AI returned empty content. Full response:', JSON.stringify(aiResponse).substring(0, 500));
      throw new Error('AI returned empty response. Please try again.');
    }

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
        console.error('No JSON found. Raw content:', content.substring(0, 500));
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content (first 500 chars):', content?.substring(0, 500));
      throw new Error('Failed to parse AI analysis. Please try again.');
    }

    // === AUGMENT WITH ALL COMPUTED DATA ===
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
    analysisResult.avgStarsPerRepo = avgStarsPerRepo;
    analysisResult.medianStars = medianStars;
    analysisResult.forkToStarRatio = forkToStarRatio;
    analysisResult.avgRepoSizeKB = Math.round(avgRepoSize);
    analysisResult.totalRepoSizeMB = Math.round(totalRepoSize / 1024);
    analysisResult.sizeDistribution = sizeDistribution;
    analysisResult.reposWithLicense = reposWithLicense;
    analysisResult.reposWithTopics = reposWithTopics;
    analysisResult.reposWithDescription = reposWithDescription;
    analysisResult.totalOpenIssues = totalOpenIssues;
    analysisResult.weekendRatio = weekendRatio;
    analysisResult.eventsPerActiveDay = eventsPerActiveDay;
    analysisResult.eventTypeBreakdown = eventTypeBreakdown;
    analysisResult.languagesByYear = languagesByYear;
    analysisResult.conventionalCommitRatio = conventionalCommitRatio;
    analysisResult.inactiveRepos = inactiveRepos;
    analysisResult.publicGists = publicGists;
    analysisResult.orgCount = orgNames.length;
    analysisResult.organizations = orgNames;
    analysisResult.licenseCounts = licenseCounts;
    analysisResult.starredInterests = Object.entries(starredLangCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    // NEW augmented metrics
    analysisResult.lateNightRatio = lateNightRatio;
    analysisResult.consistencyScore = consistencyScore;
    analysisResult.followRatio = followRatio;
    analysisResult.accountAgeYears = accountAgeYears;
    analysisResult.reposPerYear = reposPerYear;
    analysisResult.starsPerYear = starsPerYear;
    analysisResult.followersPerYear = followersPerYear;
    analysisResult.archivedRepos = archivedRepos;
    analysisResult.reposWithHomepage = reposWithHomepage;
    analysisResult.uniqueReposContributed = uniqueReposContributed;
    
    // Top repositories with full data and health scores
    const topRepos = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 12)
      .map((r: any) => {
        const ageDays = Math.floor((now.getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24));
        const lastUpdateDays = Math.floor((now.getTime() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24));
        let health = 0;
        if (r.description) health += 20;
        if (r.license) health += 15;
        if (r.topics?.length > 0) health += 10;
        if (r.homepage) health += 5;
        if (lastUpdateDays < 30) health += 25;
        else if (lastUpdateDays < 90) health += 15;
        else if (lastUpdateDays < 180) health += 5;
        health += Math.min(25, (r.stargazers_count || 0) * 2);
        
        return {
          name: r.name, description: r.description, stars: r.stargazers_count || 0,
          forks: r.forks_count || 0, language: r.language, url: r.html_url,
          full_name: r.full_name, owner: { login: r.owner?.login || user.login },
          open_issues_count: r.open_issues_count || 0, size: r.size || 0,
          created_at: r.created_at, updated_at: r.updated_at, topics: r.topics || [],
          license: r.license, watchers_count: r.watchers_count || 0,
          ageDays, lastUpdateDays, healthScore: Math.min(100, health),
          hasHomepage: !!r.homepage, defaultBranch: r.default_branch || 'main',
        };
      });
    analysisResult.topRepositories = topRepos;
    analysisResult.avgRepoHealth = topRepos.length > 0 ? Math.round(topRepos.reduce((s: number, r: any) => s + r.healthScore, 0) / topRepos.length) : 0;

    console.log('Elite analysis complete for:', user.login, '— metrics:', Object.keys(analysisResult).length);
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in analyze-github function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
