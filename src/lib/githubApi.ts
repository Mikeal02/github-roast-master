const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchGitHubUser(username: string) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
  
  if (response.status === 404) {
    throw new Error('User not found');
  }
  
  if (response.status === 403) {
    throw new Error('API rate limit exceeded. Please try again later.');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  return response.json();
}

export async function fetchUserRepos(username: string, perPage = 100) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }
  
  return response.json();
}

export async function fetchUserEvents(username: string, perPage = 100) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/events/public?per_page=${perPage}`
    );
    
    if (!response.ok) {
      console.warn('Failed to fetch user events');
      return [];
    }
    
    return response.json();
  } catch {
    return [];
  }
}

export async function fetchUserOrgs(username: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/orgs`);
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch {
    return [];
  }
}

export async function fetchUserGists(username: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/gists?per_page=30`);
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch {
    return [];
  }
}

export async function fetchRepoContributors(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=10`);
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch {
    return [];
  }
}

export async function checkReadmeExists(owner: string, repo: string) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`);
    return response.ok;
  } catch {
    return false;
  }
}

export function calculateDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Parse events to get contribution activity
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
