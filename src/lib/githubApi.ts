const GITHUB_API_BASE = 'https://api.github.com';

// Use server-side token for authenticated requests with higher rate limits
function getHeaders(): HeadersInit {
  return {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function fetchGitHubUser(username: string) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, { headers: getHeaders() });
  
  if (response.status === 404) throw new Error('User not found');
  if (response.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
  if (!response.ok) throw new Error('Failed to fetch user data');
  
  return response.json();
}

// Fetch ALL repos with pagination (up to 300)
export async function fetchUserRepos(username: string, perPage = 100) {
  const allRepos: any[] = [];
  const maxPages = 3;
  
  for (let page = 1; page <= maxPages; page++) {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated&page=${page}`,
      { headers: getHeaders() }
    );
    if (!response.ok) { if (page === 1) throw new Error('Failed to fetch repositories'); break; }
    const repos = await response.json();
    if (!repos.length) break;
    allRepos.push(...repos);
    if (repos.length < perPage) break;
  }
  
  return allRepos;
}

export async function fetchUserEvents(username: string, perPage = 100) {
  try {
    const allEvents: any[] = [];
    for (let page = 1; page <= 3; page++) {
      const response = await fetch(
        `${GITHUB_API_BASE}/users/${username}/events/public?per_page=${perPage}&page=${page}`,
        { headers: getHeaders() }
      );
      if (!response.ok) break;
      const events = await response.json();
      if (!events.length) break;
      allEvents.push(...events);
      if (events.length < perPage) break;
    }
    return allEvents;
  } catch { return []; }
}

export async function fetchUserOrgs(username: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/orgs`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export async function fetchUserGists(username: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/gists?per_page=30`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export async function fetchRepoContributors(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=10`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export async function fetchRepoLanguages(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers: getHeaders() });
    if (!response.ok) return {};
    return response.json();
  } catch { return {}; }
}

export async function fetchRepoCommits(owner: string, repo: string, perPage = 30) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export async function fetchRepoReadme(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, { headers: getHeaders() });
    if (!response.ok) return null;
    return response.json();
  } catch { return null; }
}

export async function fetchUserStarred(username: string, perPage = 30) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/starred?per_page=${perPage}`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export async function fetchRepoTopics(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/topics`, {
      headers: { ...getHeaders(), 'Accept': 'application/vnd.github.mercy-preview+json' }
    });
    if (!response.ok) return { names: [] };
    return response.json();
  } catch { return { names: [] }; }
}

export async function checkReadmeExists(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, { headers: getHeaders() });
    return response.ok;
  } catch { return false; }
}

export async function fetchUserReceivedEvents(username: string, perPage = 100) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/received_events?per_page=${perPage}`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export async function fetchUserSocialAccounts(username: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/social_accounts`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

// NEW: Fetch user's followers list for network analysis
export async function fetchUserFollowers(username: string, perPage = 30) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/followers?per_page=${perPage}`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

// NEW: Fetch user's following list
export async function fetchUserFollowing(username: string, perPage = 30) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/following?per_page=${perPage}`, { headers: getHeaders() });
    if (!response.ok) return [];
    return response.json();
  } catch { return []; }
}

export function calculateDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  return Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function parseEventsToActivity(events: any[]) {
  const activityByDate: Record<string, number> = {};
  const eventTypes: Record<string, number> = {};
  events.forEach(event => {
    const date = new Date(event.created_at).toISOString().split('T')[0];
    activityByDate[date] = (activityByDate[date] || 0) + 1;
    eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
  });
  return { activityByDate, eventTypes };
}

export function calculateCodingStreaks(events: any[]) {
  if (!events.length) return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  
  const dates = new Set<string>();
  events.forEach(event => { dates.add(new Date(event.created_at).toISOString().split('T')[0]); });
  
  const sortedDates = [...dates].sort();
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) tempStreak++;
    else { longestStreak = Math.max(longestStreak, tempStreak); tempStreak = 1; }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (dates.has(today) || dates.has(yesterday)) {
    let streak = 0;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const d = new Date(sortedDates[i]);
      const expected = new Date();
      expected.setDate(expected.getDate() - streak);
      expected.setHours(0, 0, 0, 0); d.setHours(0, 0, 0, 0);
      if (Math.abs(expected.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 1) streak++;
      else break;
    }
    currentStreak = streak;
  }
  
  return { currentStreak, longestStreak, totalActiveDays: dates.size };
}
