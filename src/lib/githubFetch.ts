// src/lib/githubFetch.ts
export const GITHUB_API_VERSION = "2022-11-28";

export async function ghFetch(
  path: string,
  token: string,
  init: RequestInit = {}
) {
  const base = "https://api.github.com";
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`); // or `token ${token}`
  }
  headers.set("Accept", "application/vnd.github+json");
  headers.set("X-GitHub-Api-Version", GITHUB_API_VERSION);

  return fetch(`${base}${path}`, { ...init, headers });
}

export async function ghJson<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await ghFetch(path, token, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GitHub API ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`
    );
  }
  return res.json() as Promise<T>;
}