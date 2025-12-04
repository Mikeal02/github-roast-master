const roastTemplates = {
  noReadme: [
    "README files are like brushing your teeth - you should do it, but clearly you don't.",
    "Your repos are like mystery boxes, except nobody wants to open them.",
    "Documentation? Never heard of her. Neither have your repos.",
    "Your code speaks for itself... unfortunately, it's screaming for help.",
  ],
  lowStars: [
    "Your star count is so low, astronomers can't even find it.",
    "Even your mom wouldn't star your repos.",
    "The only star your repos will see is the one that explodes when the sun dies.",
    "Your repos have fewer stars than a cloudy night.",
  ],
  inactive: [
    "Your GitHub is so inactive, archaeologists are studying it.",
    "Last commit was so long ago, dinosaurs were still pushing to main.",
    "Your contribution graph looks like a barcode... for a discontinued product.",
    "Ghost mode activated. Even Casper commits more than you.",
  ],
  tooManyUnfinished: [
    "You have more abandoned projects than New Year's resolutions.",
    "Your GitHub is a graveyard of good intentions.",
    "Starting projects is easy. Finishing them? You wouldn't know.",
    "Your repos are like a buffet - you tried everything but finished nothing.",
  ],
  singleLanguage: [
    "One language? That's like eating the same meal every day. Spice it up!",
    "Your tech stack has the diversity of a monochrome painting.",
    "Learning a new language won't hurt... much.",
    "You put all your eggs in one basket. The basket is on fire.",
  ],
  forkHeavy: [
    "Your GitHub is just a fork collection at this point.",
    "More forks than a fancy restaurant, but none of the original content.",
    "You're the DJ Khaled of GitHub - 'another one' but it's all forks.",
  ],
  noFollowers: [
    "Your follower count is like your code - empty.",
    "Even bots don't follow you. That takes talent.",
    "Lonely GitHub profile seeks literally anyone who cares.",
  ],
  noBio: [
    "No bio? You're basically a GitHub ghost.",
    "Your profile is as mysterious as your commit messages: empty.",
    "Who are you? Nobody knows, including your GitHub profile.",
  ],
  tooManyRepos: [
    "Quality over quantity clearly isn't your motto.",
    "You have more repos than commits. Interesting strategy.",
    "GitHub isn't Pokemon - you don't need to create them all.",
  ],
  goodDeveloper: [
    "Honestly? Not bad. I tried to find something to roast but you're annoyingly competent.",
    "You're making other developers look bad. How inconsiderate.",
    "I came here to roast, but you're already on fire (in a good way).",
    "Well-documented, active, and popular? Show-off.",
  ],
};

export function analyzeProfile(user, repos) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const avgStars = repos.length > 0 ? totalStars / repos.length : 0;
  
  const languages: Record<string, number> = {};
  repos.forEach((repo: any) => {
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
  
  const recentlyUpdated = repos.filter((repo: any) => new Date(repo.updated_at) > thirtyDaysAgo).length;
  const inactiveRepos = repos.filter((repo: any) => new Date(repo.updated_at) < ninetyDaysAgo).length;
  
  const reposWithDescription = repos.filter(repo => repo.description && repo.description.length > 10).length;
  const forkedRepos = repos.filter(repo => repo.fork).length;
  
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

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRoasts(user, analysis, scores) {
  const roasts = [];
  
  if (analysis.reposWithDescription < analysis.totalRepos * 0.5) {
    roasts.push(getRandomItem(roastTemplates.noReadme));
  }
  
  if (analysis.avgStars < 2) {
    roasts.push(getRandomItem(roastTemplates.lowStars));
  }
  
  if (analysis.inactiveRepos > analysis.totalRepos * 0.6) {
    roasts.push(getRandomItem(roastTemplates.inactive));
  }
  
  if (analysis.languageDiversity <= 1 && analysis.totalRepos > 3) {
    roasts.push(getRandomItem(roastTemplates.singleLanguage));
  }
  
  if (analysis.forkedRepos > analysis.originalRepos) {
    roasts.push(getRandomItem(roastTemplates.forkHeavy));
  }
  
  if (user.followers < 5) {
    roasts.push(getRandomItem(roastTemplates.noFollowers));
  }
  
  if (!user.bio) {
    roasts.push(getRandomItem(roastTemplates.noBio));
  }
  
  if (analysis.totalRepos > 50 && analysis.avgStars < 1) {
    roasts.push(getRandomItem(roastTemplates.tooManyRepos));
  }
  
  if (roasts.length === 0 || scores.finalScore > 70) {
    roasts.push(getRandomItem(roastTemplates.goodDeveloper));
  }
  
  return roasts.slice(0, 4);
}
