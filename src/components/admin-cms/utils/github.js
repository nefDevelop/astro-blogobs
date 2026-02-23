// src/components/admin-cms/utils/github.js
const REPO_OWNER = 'nefDevelop'; // Hardcoded as per original cms.js
const REPO_NAME = 'astro-blogobs'; // Hardcoded as per original cms.js

/**
 * Fetches data from the GitHub API.
 * @param {string} path - The API path (e.g., 'contents/src/content/posts').
 * @param {string} githubToken - The GitHub Personal Access Token.
 * @param {object} options - Fetch options.
 * @returns {Promise<any>}
 */
export async function ghFetch(path, githubToken, options = {}) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      // In a Svelte component, we would typically dispatch an event
      // to handle logout, rather than calling alert() and a global function.
      console.error('GitHub API Error: Session expired. Please re-enter your token.');
      // For now, re-throwing the error for CmsApp to handle.
    }
    throw new Error(`GitHub API Error: ${res.statusText} (Status: ${res.status})`);
  }
  return res.json();
}

// You might also want to export the REPO_OWNER and REPO_NAME if needed elsewhere
export { REPO_OWNER, REPO_NAME };
