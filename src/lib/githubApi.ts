const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchGitHubUser(username) {
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

export async function fetchUserRepos(username, perPage = 30) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }
  
  return response.json();
}

export async function checkReadmeExists(owner, repo) {
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

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
