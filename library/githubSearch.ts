/**
 * Robust GitHub Search helper with date-window pagination to bypass the 1000-result cap.
 * This file is framework-agnostic and can be imported from any component/hook.
 */

export type GitHubSearchItem = {
  id: number;
  html_url: string;
  title: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  repository_url?: string;
};

export type SearchMode = "issues" | "prs";

const GH_API = "https://api.github.com";
const PER_PAGE = 100;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const yyyymmdd = (d: Date) => d.toISOString().slice(0, 10);

function midpoint(a: Date, b: Date) {
  const m = new Date((a.getTime() + b.getTime()) / 2);
  if (yyyymmdd(m) === yyyymmdd(a)) {
    const m2 = new Date(a);
    m2.setDate(m2.getDate() + 1);
    return m2 < b ? m2 : new Date(a.getTime() + 12 * 3600 * 1000);
  }
  return m;
}

async function gh<T>(url: string, token?: string): Promise<T> {
  let attempt = 0;
  while (true) {
    const resp = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (resp.ok) {
      return (await resp.json()) as T;
    }

    if (resp.status === 403) {
      const reset = Number(resp.headers.get("X-RateLimit-Reset") || "0") * 1000;
      const waitMs = Math.max(0, reset - Date.now()) + 1000;
      if (waitMs > 0) await sleep(waitMs);
    } else if (resp.status >= 500 && resp.status < 600) {
      await sleep(300 + attempt * 300);
    } else {
      const text = await resp.text();
      throw new Error(`GitHub ${resp.status}: ${text}`);
    }

    attempt += 1;
    if (attempt >= 3) {
      const text = await resp.text().catch(() => "");
      throw new Error(
        `GitHub retry failed after ${attempt} attempts: ${resp.status} ${text}`
      );
    }
  }
}

function buildQuery(opts: {
  username: string;
  mode: SearchMode;
  state?: "open" | "closed" | "all";
  repo?: string;
  title?: string;
  start?: Date;
  end?: Date;
}) {
  const { username, mode, state = "all", repo, title, start, end } = opts;
  const q: string[] = [];
  q.push(mode === "prs" ? "type:pr" : "type:issue");
  q.push(mode === "prs" ? `author:${username}` : `involves:${username}`);
  if (repo) q.push(`repo:${repo}`);
  if (title) q.push(`in:title ${title}`);
  if (state !== "all") q.push(`state:${state}`);
  const s = start ? yyyymmdd(start) : "2008-01-01";
  const e = end ? yyyymmdd(end) : yyyymmdd(new Date());
  q.push(`created:${s}..${e}`);
  return q.join("+");
}

async function searchCount(q: string, token?: string) {
  const url = `${GH_API}/search/issues?q=${q}&per_page=1&page=1`;
  const data = await gh<{ total_count: number }>(url, token);
  return data.total_count;
}

async function fetchWindow(q: string, token?: string): Promise<GitHubSearchItem[]> {
  const items: GitHubSearchItem[] = [];
  let page = 1;
  while (true) {
    const url = `${GH_API}/search/issues?q=${q}&per_page=${PER_PAGE}&page=${page}`;
    const data = await gh<{ items: GitHubSearchItem[] }>(url, token);
    const batch = (data as any).items || [];
    if (!batch.length) break;
    items.push(...batch);
    if (batch.length < PER_PAGE) break;
    page += 1;
    await sleep(120);
  }
  return items;
}

/**
 * Main entry: robust search for a user's Issues or PRs.
 */
export async function searchUserIssuesAndPRs(params: {
  username: string;
  mode: SearchMode;
  token?: string;
  state?: "open" | "closed" | "all";
  repo?: string;
  title?: string;
  start?: Date;
  end?: Date;
}): Promise<GitHubSearchItem[]> {
  const start = params.start ?? new Date("2008-01-01");
  const end = params.end ?? new Date();

  async function recurse(win: { start: Date; end: Date }): Promise<GitHubSearchItem[]> {
    const q = buildQuery({ ...params, start: win.start, end: win.end });
    const count = await searchCount(q, params.token);

    if (count === 0) return [];
    if (count <= 1000) return fetchWindow(q, params.token);

    const mid = midpoint(win.start, win.end);
    const left = await recurse({ start: win.start, end: mid });
    const right = await recurse({ start: new Date(mid.getTime() + 1000), end: win.end });
    return [...left, ...right];
  }

  const results = await recurse({ start, end });

  // de-dupe and sort newest-first
  const seen = new Set<number>();
  const unique = results.filter((it) => (seen.has(it.id) ? false : (seen.add(it.id), true)));
  unique.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return unique;
}

/**
 * Convenience wrapper matching common caller shapes.
 */
export async function fetchUserItems(opts: {
  username: string;
  activeTab?: "pulls" | "issues";
  userProvidedToken?: string;
  state?: "open" | "closed" | "all";
  repo?: string;
  title?: string;
  start?: Date;
  end?: Date;
}) {
  const token =
    (opts.userProvidedToken && opts.userProvidedToken.trim()) ||
    (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_GITHUB_TOKEN) ||
    undefined;

  const mode: SearchMode = opts.activeTab === "pulls" ? "prs" : "issues";

  return searchUserIssuesAndPRs({
    username: opts.username,
    mode,
    token,
    state: opts.state,
    repo: opts.repo,
    title: opts.title,
    start: opts.start,
    end: opts.end,
  });
}