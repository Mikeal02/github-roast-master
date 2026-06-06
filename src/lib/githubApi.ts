const GITHUB_API_BASE = 'https://api.github.com';

// Use server-side token for authenticated requests with higher rate limits
function getHeaders(extra?: HeadersInit): HeadersInit {
  return {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(extra || {}),
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Proactive rate-limit handling: in-memory + localStorage cache, exponential
// backoff with jitter, and respect for GitHub's rate-limit reset headers.
// ──────────────────────────────────────────────────────────────────────────

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'gh-cache:';
const MAX_RETRIES = 4;

type CacheEntry = { ts: number; data: any };

const memoryCache = new Map<string, CacheEntry>();
// De-duplicate concurrent identical requests.
const inflight = new Map<string, Promise<any>>();

// Tracks when GitHub says we can resume after a rate-limit hit.
let rateLimitResetAt = 0;

function readCache(key: string): any | undefined {
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.ts < CACHE_TTL) return mem.data;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.ts < CACHE_TTL) {
        memoryCache.set(key, entry);
        return entry.data;
      }
      localStorage.removeItem(CACHE_PREFIX + key);
    }
  } catch { /* ignore storage errors */ }
  return undefined;
}

function writeCache(key: string, data: any) {
  const entry: CacheEntry = { ts: Date.now(), data };
  memoryCache.set(key, entry);
  try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry)); } catch { /* quota */ }
}

// Return any stale cached value (ignores TTL) — used as a fallback when the API
// is rate-limited so the Data tab stays responsive.
function readStale(key: string): any | undefined {
  const mem = memoryCache.get(key);
  if (mem) return mem.data;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (raw) return (JSON.parse(raw) as CacheEntry).data;
  } catch { /* ignore */ }
  return undefined;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class RateLimitError extends Error {
  constructor() { super('API rate limit exceeded. Please try again later.'); }
}

/**
 * Core fetch with caching + exponential backoff.
 * Throws on rate-limit exhaustion; returns { data, status } otherwise.
 */
async function ghFetch(url: string, extraHeaders?: HeadersInit): Promise<{ data: any; status: number } | null> {
  const key = url;
  const cached = readCache(key);
  if (cached !== undefined) return { data: cached, status: 200 };

  if (inflight.has(key)) return inflight.get(key)!;

  const run = (async () => {
    let lastStatus = 0;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      // If we already know we're limited, wait until the reset window.
      const waitForReset = rateLimitResetAt - Date.now();
      if (waitForReset > 0) {
        const stale = readStale(key);
        if (stale !== undefined) return { data: stale, status: 200 };
        await sleep(Math.min(waitForReset, 15000));
      }

      let response: Response;
      try {
        response = await fetch(url, { headers: getHeaders(extraHeaders) });
      } catch {
        // Network error → exponential backoff with jitter.
        await sleep(Math.min(2 ** attempt * 500 + Math.random() * 300, 8000));
        continue;
      }

      lastStatus = response.status;
      if (response.status === 404) return { data: null, status: 404 };

      // Rate limited (primary or secondary).
      const remaining = response.headers.get('x-ratelimit-remaining');
      const isRateLimited =
        response.status === 429 ||
        (response.status === 403 && (remaining === '0' || !!response.headers.get('retry-after')));

      if (isRateLimited) {
        const retryAfter = response.headers.get('retry-after');
        const reset = response.headers.get('x-ratelimit-reset');
        let waitMs: number;
        if (retryAfter) waitMs = parseInt(retryAfter, 10) * 1000;
        else if (reset) waitMs = Math.max(0, parseInt(reset, 10) * 1000 - Date.now());
        else waitMs = 2 ** attempt * 1000 + Math.random() * 500; // backoff + jitter

        rateLimitResetAt = Date.now() + waitMs;
        const stale = readStale(key);
        if (stale !== undefined) return { data: stale, status: 200 };
        if (attempt === MAX_RETRIES) throw new RateLimitError();
        await sleep(Math.min(waitMs, 15000));
        continue;
      }

      if (!response.ok) {
        // Transient server errors → retry with backoff.
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          await sleep(2 ** attempt * 500 + Math.random() * 300);
          continue;
        }
        return { data: null, status: response.status };
      }

      const data = await response.json();
      writeCache(key, data);
      return { data, status: response.status };
    }
    // Retries exhausted.
    const stale = readStale(key);
    if (stale !== undefined) return { data: stale, status: 200 };
    if (lastStatus === 403 || lastStatus === 429) throw new RateLimitError();
    return { data: null, status: lastStatus };
  })();

  inflight.set(key, run);
  try { return await run; }
  finally { inflight.delete(key); }
}

export async function fetchGitHubUser(username: string) {
  const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}`);
  if (!res || res.status === 404) throw new Error('User not found');
  if (res.data === null) throw new Error('Failed to fetch user data');
  return res.data;
}

// Fetch ALL repos with pagination (up to 500)
export async function fetchUserRepos(username: string, perPage = 100) {
  const allRepos: any[] = [];
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page++) {
    const res = await ghFetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated&page=${page}`
    );
    if (!res || !Array.isArray(res.data)) { if (page === 1) throw new Error('Failed to fetch repositories'); break; }
    const repos = res.data;
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
      const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/events/public?per_page=${perPage}&page=${page}`);
      if (!res || !Array.isArray(res.data)) break;
      const events = res.data;
      if (!events.length) break;
      allEvents.push(...events);
      if (events.length < perPage) break;
    }
    return allEvents;
  } catch { return []; }
}

export async function fetchUserOrgs(username: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/orgs?per_page=100`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

export async function fetchUserGists(username: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/gists?per_page=50`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

export async function fetchRepoContributors(owner: string, repo: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=10`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

export async function fetchRepoLanguages(owner: string, repo: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`);
    return res?.data && typeof res.data === 'object' ? res.data : {};
  } catch { return {}; }
}

export async function fetchRepoCommits(owner: string, repo: string, perPage = 30) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

export async function fetchRepoReadme(owner: string, repo: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`);
    return res?.data ?? null;
  } catch { return null; }
}

export async function fetchUserStarred(username: string, perPage = 30) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/starred?per_page=${perPage}`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

export async function fetchRepoTopics(owner: string, repo: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/topics`, { 'Accept': 'application/vnd.github.mercy-preview+json' });
    return res?.data ?? { names: [] };
  } catch { return { names: [] }; }
}

export async function checkReadmeExists(owner: string, repo: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`);
    return !!res && res.status === 200 && res.data !== null;
  } catch { return false; }
}

export async function fetchUserReceivedEvents(username: string, perPage = 100) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/received_events?per_page=${perPage}`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

export async function fetchUserSocialAccounts(username: string) {
  try {
    const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/social_accounts`);
    return Array.isArray(res?.data) ? res!.data : [];
  } catch { return []; }
}

// Fetch user's followers list for network analysis (paginated)
export async function fetchUserFollowers(username: string, perPage = 100, maxPages = 2) {
  try {
    const all: any[] = [];
    for (let page = 1; page <= maxPages; page++) {
      const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/followers?per_page=${perPage}&page=${page}`);
      if (!res || !Array.isArray(res.data) || !res.data.length) break;
      all.push(...res.data);
      if (res.data.length < perPage) break;
    }
    return all;
  } catch { return []; }
}

// Fetch user's following list (paginated)
export async function fetchUserFollowing(username: string, perPage = 100, maxPages = 2) {
  try {
    const all: any[] = [];
    for (let page = 1; page <= maxPages; page++) {
      const res = await ghFetch(`${GITHUB_API_BASE}/users/${username}/following?per_page=${perPage}&page=${page}`);
      if (!res || !Array.isArray(res.data) || !res.data.length) break;
      all.push(...res.data);
      if (res.data.length < perPage) break;
    }
    return all;
  } catch { return []; }
}

// Clear cached GitHub responses (useful for a manual refresh button).
export function clearGitHubCache() {
  memoryCache.clear();
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
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
