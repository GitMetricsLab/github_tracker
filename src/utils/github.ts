export async function fetchRepo(repo: string) {
  const normalizedRepo = repo.trim();
  const res = await fetch(`https://api.github.com/repos/${normalizedRepo}`);
  if (!res.ok) {
    throw new Error(`Repository not found: ${normalizedRepo}`);
  }
  return res.json();
}
}

export async function compareRepos(repo1: string, repo2: string) {
  const [a, b] = await Promise.all([
    fetchRepo(repo1),
    fetchRepo(repo2),
  ]);

  return { a, b };
}