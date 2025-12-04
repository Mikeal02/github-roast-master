const roastTemplates = {
  noReadme: [
    "README files are like brushing your teeth - you should do it, but clearly you don't. ({readmeCount}/{totalRepos} repos have descriptions)",
    "Your repos are like mystery boxes, except nobody wants to open them. Only {readmeCount} documented!",
    "Documentation? Never heard of her. Neither have your {undocumentedCount} undocumented repos.",
    "Your code speaks for itself... unfortunately, it's screaming for help. {docPercent}% documented.",
  ],
  lowStars: [
    "Your star count is so low ({totalStars} total), astronomers can't even find it.",
    "Even your mom wouldn't star your repos. {totalStars} stars across {totalRepos} repos? Oof.",
    "The only star your repos will see is the one that explodes when the sun dies. Current count: {totalStars}.",
    "Your repos have fewer stars ({totalStars}) than a cloudy night.",
  ],
  inactive: [
    "Your GitHub is so inactive ({daysSinceUpdate} days since last update), archaeologists are studying it.",
    "Last commit was {daysSinceUpdate} days ago. Dinosaurs were still pushing to main.",
    "Your contribution graph looks like a barcode... for a discontinued product. {inactiveCount} inactive repos!",
    "Ghost mode activated for {daysSinceUpdate} days. Even Casper commits more than you.",
  ],
  tooManyUnfinished: [
    "You have {inactiveCount} abandoned projects - more than New Year's resolutions.",
    "Your GitHub is a graveyard of {inactiveCount} good intentions.",
    "Starting projects is easy. Finishing them? You wouldn't know. {inactiveCount} repos gathering dust.",
    "Your repos are like a buffet - you tried {totalRepos} things but finished nothing.",
  ],
  singleLanguage: [
    "One language ({topLanguage})? That's like eating the same meal every day. Spice it up!",
    "Your tech stack has the diversity of a monochrome painting. Just {languageCount} language(s).",
    "Learning a new language won't hurt... much. Currently stuck on {topLanguage}.",
    "You put all your eggs in one {topLanguage} basket. The basket is on fire.",
  ],
  forkHeavy: [
    "Your GitHub is just a fork collection at this point. {forkedCount} forks vs {originalCount} original.",
    "More forks ({forkedCount}) than a fancy restaurant, but none of the original content.",
    "You're the DJ Khaled of GitHub - 'another one' but it's all {forkedCount} forks.",
  ],
  noFollowers: [
    "Your follower count ({followers}) is like your code - empty.",
    "Even bots don't follow you. {followers} followers? That takes talent.",
    "Lonely GitHub profile with {followers} followers seeks literally anyone who cares.",
  ],
  noBio: [
    "No bio? You're basically a GitHub ghost.",
    "Your profile is as mysterious as your commit messages: empty.",
    "Who are you? Nobody knows, including your GitHub profile.",
  ],
  tooManyRepos: [
    "Quality over quantity clearly isn't your motto. {totalRepos} repos, {avgStars} avg stars.",
    "You have more repos ({totalRepos}) than commits. Interesting strategy.",
    "GitHub isn't Pokemon - you don't need to create all {totalRepos}.",
  ],
  goodDeveloper: [
    "Honestly? Not bad. {totalStars} stars, {docPercent}% documented. Annoyingly competent.",
    "You're making other developers look bad with your {finalScore} score. How inconsiderate.",
    "I came here to roast, but you're already on fire (in a good way). {totalStars} stars!",
    "Well-documented ({docPercent}%), active, and {totalStars} stars? Show-off.",
  ],
};

const recruiterTemplates = {
  activity: {
    good: "Shows consistent engagement with {recentCount} recently updated repositories.",
    bad: "Activity concerns: No updates in the past {daysSinceUpdate} days.",
  },
  documentation: {
    good: "Strong documentation practices with {docPercent}% of repositories properly described.",
    bad: "Documentation gap: Only {docPercent}% of repositories have descriptions.",
  },
  popularity: {
    good: "Community recognition with {totalStars} total stars across projects.",
    bad: "Limited community traction with {totalStars} total stars.",
  },
  diversity: {
    good: "Versatile skill set demonstrated across {languageCount} programming languages.",
    bad: "Focused expertise in {topLanguage}, opportunity to expand technical breadth.",
  },
};

export function getSeverityLabel(score) {
  if (score <= 20) return { label: 'Critical', color: 'text-terminal-red' };
  if (score <= 40) return { label: 'Weak', color: 'text-terminal-yellow' };
  if (score <= 60) return { label: 'Decent', color: 'text-terminal-cyan' };
  if (score <= 80) return { label: 'Strong', color: 'text-terminal-green' };
  return { label: 'Elite', color: 'text-primary' };
}

export function getActivityTimeLabel(daysSinceUpdate) {
  if (daysSinceUpdate <= 7) return 'Active within last 7 days';
  if (daysSinceUpdate <= 30) return 'Active within last month';
  if (daysSinceUpdate <= 90) return 'No activity in last 3 months';
  if (daysSinceUpdate <= 180) return 'No activity in last 6 months';
  return `No activity in ${Math.floor(daysSinceUpdate / 30)} months`;
}

export function analyzeProfile(user, repos) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const avgStars = repos.length > 0 ? totalStars / repos.length : 0;
  
  const languages = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  
  const languageEntries = Object.entries(languages).sort((a, b) => (b[1] as number) - (a[1] as number));
  const mostUsedLanguage = languageEntries[0]?.[0] || 'None';
  const languageDiversity = Object.keys(languages).length;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  const recentlyUpdated = repos.filter((repo) => new Date(repo.updated_at) > thirtyDaysAgo).length;
  const inactiveRepos = repos.filter((repo) => new Date(repo.updated_at) < ninetyDaysAgo).length;
  
  const reposWithDescription = repos.filter(repo => repo.description && repo.description.length > 10).length;
  const forkedRepos = repos.filter(repo => repo.fork).length;
  
  // Calculate days since last update
  const lastUpdatedRepo = repos.length > 0 
    ? repos.reduce((latest, repo) => 
        new Date(repo.updated_at) > new Date(latest.updated_at) ? repo : latest
      )
    : null;
  const daysSinceLastUpdate = lastUpdatedRepo 
    ? Math.floor((now.getTime() - new Date(lastUpdatedRepo.updated_at).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Calculate docs coverage percentage
  const docsCoverage = repos.length > 0 ? Math.round((reposWithDescription / repos.length) * 100) : 0;
  
  // Calculate solo repo percentage (repos with only 1 contributor approximation - no forks received)
  const soloRepos = repos.filter(repo => !repo.fork && repo.forks_count === 0).length;
  const soloRepoPercentage = repos.length > 0 ? Math.round((soloRepos / repos.length) * 100) : 0;

  return {
    totalStars,
    totalForks,
    avgStars,
    languages: languageEntries,
    mostUsedLanguage,
    languageDiversity,
    recentlyUpdated,
    inactiveRepos,
    reposWithDescription,
    forkedRepos,
    totalRepos: repos.length,
    originalRepos: repos.length - forkedRepos,
    daysSinceLastUpdate,
    docsCoverage,
    soloRepoPercentage,
  };
}

export function calculateScores(user, analysis) {
  const activityScore = Math.min(100, Math.round(
    (analysis.recentlyUpdated / Math.max(analysis.totalRepos, 1)) * 100 * 0.6 +
    (1 - analysis.inactiveRepos / Math.max(analysis.totalRepos, 1)) * 100 * 0.4
  ));
  
  const documentationScore = Math.min(100, Math.round(
    (analysis.reposWithDescription / Math.max(analysis.totalRepos, 1)) * 100
  ));
  
  const popularityScore = Math.min(100, Math.round(
    Math.min(analysis.avgStars * 10, 50) +
    Math.min(user.followers / 10, 30) +
    Math.min(analysis.totalStars / 50, 20)
  ));
  
  const diversityScore = Math.min(100, Math.round(
    Math.min(analysis.languageDiversity * 15, 60) +
    (analysis.originalRepos / Math.max(analysis.totalRepos, 1)) * 40
  ));
  
  const finalScore = Math.round(
    activityScore * 0.3 +
    documentationScore * 0.2 +
    popularityScore * 0.25 +
    diversityScore * 0.25
  );
  
  let activityStatus = 'Ghost Mode 👻';
  if (analysis.recentlyUpdated >= 3) {
    activityStatus = 'Active 🔥';
  } else if (analysis.recentlyUpdated >= 1) {
    activityStatus = 'Semi-Active 😴';
  }
  
  return {
    activityScore,
    documentationScore,
    popularityScore,
    diversityScore,
    finalScore,
    activityStatus,
  };
}

export function getScoreExplanations(user, analysis, scores) {
  const explanations = {
    activity: analysis.daysSinceLastUpdate <= 7 
      ? `Last repository updated ${analysis.daysSinceLastUpdate} days ago`
      : `Last public repository updated ${analysis.daysSinceLastUpdate} days ago`,
    documentation: `${analysis.reposWithDescription} out of ${analysis.totalRepos} repositories have descriptions`,
    popularity: `Total stars across all repos: ${analysis.totalStars}`,
    diversity: `Uses ${analysis.languageDiversity} primary language${analysis.languageDiversity !== 1 ? 's' : ''}`,
    overall: `Based on activity (${scores.activityScore}), docs (${scores.documentationScore}), popularity (${scores.popularityScore}), diversity (${scores.diversityScore})`,
  };
  
  return explanations;
}

export function getDeveloperArchetype(user, analysis, scores) {
  // Tutorial Warrior - lots of forks, few original repos
  if (analysis.forkedRepos > analysis.originalRepos * 2) {
    return { name: 'Tutorial Warrior', emoji: '📚', description: 'Learns by forking' };
  }
  
  // One Repo Wonder - only 1-2 repos but decent activity
  if (analysis.totalRepos <= 2 && analysis.totalRepos > 0) {
    return { name: 'One Repo Wonder', emoji: '🎯', description: 'Quality over quantity' };
  }
  
  // Framework Collector - many languages, low stars
  if (analysis.languageDiversity >= 5 && analysis.avgStars < 2) {
    return { name: 'Framework Collector', emoji: '🧪', description: 'Tries everything once' };
  }
  
  // Silent Assassin - good code, no followers
  if (scores.documentationScore >= 60 && user.followers < 10 && analysis.totalStars > 0) {
    return { name: 'Silent Assassin', emoji: '🥷', description: 'Codes in stealth mode' };
  }
  
  // Weekend Hacker - some activity but inconsistent
  if (analysis.recentlyUpdated >= 1 && analysis.inactiveRepos > analysis.totalRepos * 0.5) {
    return { name: 'Weekend Hacker', emoji: '🌙', description: 'Codes when inspired' };
  }
  
  // Idea Hoarder - many repos, few completed
  if (analysis.totalRepos > 15 && analysis.docsCoverage < 30) {
    return { name: 'Idea Hoarder', emoji: '💡', description: 'Starts more than finishes' };
  }
  
  // Open Source Hero - high stars, good docs
  if (analysis.totalStars > 100 && analysis.docsCoverage > 70) {
    return { name: 'Open Source Hero', emoji: '🦸', description: 'Community champion' };
  }
  
  // Rising Star - active with growing presence
  if (scores.activityScore >= 60 && scores.finalScore >= 50) {
    return { name: 'Rising Star', emoji: '⭐', description: 'On the way up' };
  }
  
  // Ghost Developer - very inactive
  if (analysis.daysSinceLastUpdate > 180) {
    return { name: 'Ghost Developer', emoji: '👻', description: 'Missing in action' };
  }
  
  // Default
  return { name: 'Code Explorer', emoji: '🧭', description: 'Finding their path' };
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function fillTemplate(template, data) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

export function generateRoasts(user, analysis, scores) {
  const roasts = [];
  const data = {
    totalStars: analysis.totalStars,
    totalRepos: analysis.totalRepos,
    readmeCount: analysis.reposWithDescription,
    undocumentedCount: analysis.totalRepos - analysis.reposWithDescription,
    docPercent: analysis.docsCoverage,
    daysSinceUpdate: analysis.daysSinceLastUpdate,
    inactiveCount: analysis.inactiveRepos,
    topLanguage: analysis.mostUsedLanguage,
    languageCount: analysis.languageDiversity,
    forkedCount: analysis.forkedRepos,
    originalCount: analysis.originalRepos,
    followers: user.followers,
    avgStars: analysis.avgStars.toFixed(1),
    finalScore: scores.finalScore,
    recentCount: analysis.recentlyUpdated,
  };
  
  if (analysis.reposWithDescription < analysis.totalRepos * 0.5) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.noReadme), data));
  }
  
  if (analysis.avgStars < 2) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.lowStars), data));
  }
  
  if (analysis.inactiveRepos > analysis.totalRepos * 0.6) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.inactive), data));
  }
  
  if (analysis.languageDiversity <= 1 && analysis.totalRepos > 3) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.singleLanguage), data));
  }
  
  if (analysis.forkedRepos > analysis.originalRepos) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.forkHeavy), data));
  }
  
  if (user.followers < 5) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.noFollowers), data));
  }
  
  if (!user.bio) {
    roasts.push(getRandomItem(roastTemplates.noBio));
  }
  
  if (analysis.totalRepos > 50 && analysis.avgStars < 1) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.tooManyRepos), data));
  }
  
  if (roasts.length === 0 || scores.finalScore > 70) {
    roasts.push(fillTemplate(getRandomItem(roastTemplates.goodDeveloper), data));
  }
  
  return roasts.slice(0, 4);
}

export function generateRecruiterInsights(user, analysis, scores) {
  const insights = [];
  const data = {
    totalStars: analysis.totalStars,
    docPercent: analysis.docsCoverage,
    daysSinceUpdate: analysis.daysSinceLastUpdate,
    languageCount: analysis.languageDiversity,
    topLanguage: analysis.mostUsedLanguage,
    recentCount: analysis.recentlyUpdated,
  };
  
  // Activity insight
  if (scores.activityScore >= 50) {
    insights.push(fillTemplate(recruiterTemplates.activity.good, data));
  } else {
    insights.push(fillTemplate(recruiterTemplates.activity.bad, data));
  }
  
  // Documentation insight
  if (scores.documentationScore >= 50) {
    insights.push(fillTemplate(recruiterTemplates.documentation.good, data));
  } else {
    insights.push(fillTemplate(recruiterTemplates.documentation.bad, data));
  }
  
  // Popularity insight
  if (scores.popularityScore >= 30) {
    insights.push(fillTemplate(recruiterTemplates.popularity.good, data));
  } else {
    insights.push(fillTemplate(recruiterTemplates.popularity.bad, data));
  }
  
  // Diversity insight
  if (scores.diversityScore >= 50) {
    insights.push(fillTemplate(recruiterTemplates.diversity.good, data));
  } else {
    insights.push(fillTemplate(recruiterTemplates.diversity.bad, data));
  }
  
  return insights;
}
