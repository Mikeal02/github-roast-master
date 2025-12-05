export function analyzePersonality(user: any, repos: any[], analysis: any, scores: any) {
  const now = new Date();
  
  // Calculate activity patterns
  const reposByDay = repos.map((repo: any) => {
    const updated = new Date(repo.updated_at);
    return updated.getDay();
  });
  
  const dayFrequency = [0, 0, 0, 0, 0, 0, 0];
  reposByDay.forEach(day => dayFrequency[day]++);
  
  const peakDay = dayFrequency.indexOf(Math.max(...dayFrequency));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Calculate consistency score
  const activeMonths = new Set(repos.map((repo: any) => {
    const d = new Date(repo.updated_at);
    return `${d.getFullYear()}-${d.getMonth()}`;
  })).size;
  
  // Focus Type Analysis
  const avgRepoSize = repos.length > 0 
    ? repos.reduce((sum: number, r: any) => sum + (r.size || 0), 0) / repos.length 
    : 0;
  const hasLargeProjects = repos.some((r: any) => r.size > 1000);
  const focusType = hasLargeProjects || avgRepoSize > 500 ? 'Deep Work' : 'Short Bursts';
  
  // Procrastination Tendency
  const gapsBetweenUpdates = calculateActivityGaps(repos);
  const procrastinationScore = Math.min(100, Math.round(
    (analysis.inactiveRepos / Math.max(analysis.totalRepos, 1)) * 50 +
    (gapsBetweenUpdates > 60 ? 30 : gapsBetweenUpdates > 30 ? 15 : 0) +
    (analysis.recentlyUpdated < 2 ? 20 : 0)
  ));
  
  // Burnout Risk
  const repoCreationRate = analysis.totalRepos / Math.max(1, getAccountAgeMonths(user.created_at));
  const burnoutRisk = Math.min(100, Math.round(
    (repoCreationRate > 3 ? 30 : 0) +
    (analysis.languageDiversity > 5 ? 20 : 0) +
    (analysis.inactiveRepos > analysis.totalRepos * 0.7 ? 30 : 0) +
    (analysis.forkedRepos > analysis.originalRepos ? 20 : 0)
  ));
  
  // Learning Style
  const learningStyle = determineLearningStyle(analysis, repos);
  
  // Fun Insights
  const funInsights = generateFunInsights(user, repos, analysis, dayNames[peakDay], scores);
  
  // Suggestions
  const suggestions = generateSuggestions(analysis, scores, procrastinationScore, burnoutRisk);
  
  // Coder Personality Type
  const personalityType = determinePersonalityType(analysis, scores, focusType);
  
  return {
    focusType,
    procrastinationTendency: procrastinationScore,
    burnoutRisk,
    learningStyle,
    peakActivityDay: dayNames[peakDay],
    funInsights,
    suggestions,
    personalityType,
    metrics: {
      consistency: Math.round((activeMonths / 12) * 100),
      exploration: Math.min(100, analysis.languageDiversity * 15),
      collaboration: Math.min(100, (user.followers + user.following) * 2),
      documentation: scores.documentationScore,
    }
  };
}

function calculateActivityGaps(repos: any[]): number {
  if (repos.length < 2) return 0;
  
  const dates = repos
    .map((r: any) => new Date(r.updated_at).getTime())
    .sort((a, b) => b - a);
  
  let maxGap = 0;
  for (let i = 0; i < dates.length - 1; i++) {
    const gap = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
    if (gap > maxGap) maxGap = gap;
  }
  
  return Math.round(maxGap);
}

function getAccountAgeMonths(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.max(1, Math.round((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 30)));
}

function determineLearningStyle(analysis: any, repos: any[]): string {
  const hasWebProjects = repos.some((r: any) => 
    ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React'].includes(r.language)
  );
  const hasDataProjects = repos.some((r: any) => 
    ['Python', 'R', 'Julia', 'Jupyter Notebook'].includes(r.language)
  );
  
  if (analysis.languageDiversity >= 4) return 'Explorer / Multi-Domain';
  if (hasDataProjects) return 'Analytical / Data-Driven';
  if (hasWebProjects) return 'Visual / Project-Based';
  if (analysis.forkedRepos > analysis.originalRepos / 2) return 'Learning by Example';
  return 'Focused / Specialist';
}

function determinePersonalityType(analysis: any, scores: any, focusType: string): { type: string; emoji: string; description: string } {
  if (scores.finalScore > 75 && analysis.languageDiversity >= 4) {
    return { type: 'The Polyglot', emoji: '🌐', description: 'Master of many languages, fear of none' };
  }
  if (focusType === 'Deep Work' && scores.documentationScore > 60) {
    return { type: 'The Architect', emoji: '🏗️', description: 'Builds systems that last, documents everything' };
  }
  if (analysis.forkedRepos > analysis.originalRepos) {
    return { type: 'The Curator', emoji: '📚', description: 'Collects knowledge from across the ecosystem' };
  }
  if (scores.activityScore > 70 && analysis.recentlyUpdated >= 5) {
    return { type: 'The Machine', emoji: '⚡', description: 'Commits daily, ships constantly, never stops' };
  }
  if (analysis.totalStars > 50) {
    return { type: 'The Influencer', emoji: '⭐', description: 'Creates things people actually want to use' };
  }
  if (scores.activityScore < 30) {
    return { type: 'The Phantom', emoji: '👻', description: 'Codes in stealth mode, emerges rarely' };
  }
  if (analysis.languageDiversity === 1) {
    return { type: 'The Purist', emoji: '🎯', description: 'One language to rule them all' };
  }
  return { type: 'The Explorer', emoji: '🧭', description: 'Always learning, always experimenting' };
}

function generateFunInsights(user: any, repos: any[], analysis: any, peakDay: string, scores: any): string[] {
  const insights: string[] = [];
  
  insights.push(`Your repos are most active on ${peakDay}s - your brain clearly has a favorite day! 📅`);
  
  if (analysis.mostUsedLanguage !== 'None') {
    const percentage = Math.round((analysis.languages[0]?.[1] || 0) / analysis.totalRepos * 100);
    insights.push(`${analysis.mostUsedLanguage} makes up ${percentage}% of your repos - it's basically your native tongue now.`);
  }
  
  if (analysis.forkedRepos > 3) {
    insights.push(`You've forked ${analysis.forkedRepos} repos. Ctrl+C, Ctrl+V is also a valid learning strategy! 🍴`);
  }
  
  if (user.followers > user.following * 2) {
    insights.push(`${user.followers} followers but only following ${user.following}? Main character energy detected. 👑`);
  } else if (user.following > user.followers * 2) {
    insights.push(`Following ${user.following} people but only ${user.followers} follow back? You're a generous soul. 🤝`);
  }
  
  if (analysis.avgStars > 5) {
    insights.push(`Average ${analysis.avgStars.toFixed(1)} stars per repo - people actually like your code!`);
  } else if (analysis.totalStars === 0) {
    insights.push(`Zero stars across all repos - you're coding in airplane mode. ✈️`);
  }
  
  const accountAge = getAccountAgeMonths(user.created_at);
  if (accountAge > 36 && analysis.totalRepos < 10) {
    insights.push(`${Math.round(accountAge/12)} years on GitHub with ${analysis.totalRepos} repos - quality over quantity vibes.`);
  }
  
  if (scores.documentationScore < 20) {
    insights.push(`Your documentation score suggests you believe code should be self-explanatory. Bold. 📖`);
  }
  
  return insights.slice(0, 5);
}

function generateSuggestions(analysis: any, scores: any, procrastination: number, burnout: number): string[] {
  const suggestions: string[] = [];
  
  if (procrastination > 50) {
    suggestions.push('Try the 2-minute rule: if a commit takes less than 2 minutes, do it now.');
  }
  
  if (burnout > 60) {
    suggestions.push('Your activity patterns suggest high intensity. Schedule rest days to avoid burnout.');
  }
  
  if (scores.documentationScore < 40) {
    suggestions.push('Add README files to your repos - future you will thank present you.');
  }
  
  if (analysis.languageDiversity < 2 && analysis.totalRepos > 5) {
    suggestions.push('Consider exploring a new language - it expands your problem-solving toolkit.');
  }
  
  if (analysis.inactiveRepos > analysis.totalRepos / 2) {
    suggestions.push('Archive or delete old repos to keep your profile fresh and focused.');
  }
  
  if (scores.activityScore < 40) {
    suggestions.push('Set a weekly coding goal, even if it\'s just 1 commit - consistency beats intensity.');
  }
  
  if (analysis.forkedRepos > analysis.originalRepos) {
    suggestions.push('Challenge yourself to create more original projects to showcase your unique skills.');
  }
  
  return suggestions.slice(0, 4);
}
