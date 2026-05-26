export async function fetchRepo(repo: string) {
  const res = await fetch(`https://api.github.com/repos/${repo}`);
  return res.json();
}

export async function compareRepos(repo1: string, repo2: string) {
  const [a, b] = await Promise.all([
    fetchRepo(repo1),
    fetchRepo(repo2),
  ]);

  return { a, b };
}