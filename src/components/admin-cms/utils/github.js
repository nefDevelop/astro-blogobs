// src/components/admin-cms/utils/github.js
const REPO_OWNER = 'nefDevelop';
const REPO_NAME = 'astro-blogobs';

/**
 * Fetches data from the GitHub API.
 */
export async function ghFetch(path, githubToken, options = {}) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.error('GitHub API Error: Session expired or invalid token.');
      }
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Error ${res.status}`);
    }
    
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Error de red: No se pudo conectar con GitHub. Verifica tu conexión o el estado de la API.');
    }
    throw err;
  }
}

export { REPO_OWNER, REPO_NAME };
