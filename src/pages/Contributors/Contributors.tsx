import { ghFetch as gh } from "../../lib/githubFetch";
import { useEffect, useState } from "react";

export default function Contributors() {
  const [contributors, setContributors] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getToken() {
      return (
        localStorage.getItem("gh_pat") ||
        localStorage.getItem("github_pat") ||
        localStorage.getItem("token") ||
        ""
      );
    }

    async function resolveRepoFullName(token: string): Promise<string | null> {
      // Try to find the repo by searching both org and user scopes and dash/underscore variants
      const owners = ["GitMetricsLab", "gitmetricsslab", "ASR1015"]; // include common forks/owners
      const names = ["github-tracker", "github_tracker"]; // dash vs underscore

      for (const owner of owners) {
        for (const name of names) {
          // org search
          try {
            const q = `org:${owner}+${name}+in:name`;
            const res = await gh(`/search/repositories?q=${encodeURIComponent(q)}&per_page=5`, token);
            const json = await res.json();
            const match = (json.items || []).find(
              (it: any) => it.name.toLowerCase() === name.toLowerCase()
            );
            if (match?.full_name) return match.full_name as string;
          } catch {}

          // user search
          try {
            const q2 = `user:${owner}+${name}+in:name`;
            const res2 = await gh(`/search/repositories?q=${encodeURIComponent(q2)}&per_page=5`, token);
            const json2 = await res2.json();
            const match2 = (json2.items || []).find(
              (it: any) => it.name.toLowerCase() === name.toLowerCase()
            );
            if (match2?.full_name) return match2.full_name as string;
          } catch {}
        }
      }
      return null;
    }

    async function loadContributors() {
      setLoading(true);
      setError("");
      setContributors([]);
      const token =
        localStorage.getItem("gh_pat") ||
        localStorage.getItem("github_pat") ||
        localStorage.getItem("token") ||
        "";

      try {
        const fallback = "ASR1015/github_tracker";
        const fullName = (await resolveRepoFullName(token)) ?? fallback;
        console.log(`[contributors] fetching for ${fullName}`);

        const res = await gh(
          `/repos/${fullName}/contributors?per_page=50`,
          token
        );

        // Some repos return 204 No Content when there are no contributors.
        // res.ok is true for 204, but res.json() would throw; handle it explicitly.
        if (res.status === 204) {
          setContributors([]);
          return;
        }

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`GitHub ${res.status}: ${txt}`);
        }

        const data = await res.json();
        setContributors(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(
          err?.message ||
            "Failed to fetch contributors. Check owner/repo and token (use 'repo' scope if private)."
        );
        console.error("[contributors] error", err);
      } finally {
        setLoading(false);
      }
    }

    loadContributors();
  }, []);

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Contributors</h1>
      {loading && <div className="opacity-70 mb-2">Loading…</div>}
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>
      )}
      <ul className="space-y-2">
        {contributors.map((c) => (
          <li key={c.id} className="flex items-center gap-3">
            <img src={c.avatar_url} alt={c.login} width={32} height={32} className="rounded-full" />
            <a href={c.html_url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
              {c.login}
            </a>
            <span className="opacity-70">({c.contributions} contributions)</span>
          </li>
        ))}
        {!loading && contributors.length === 0 && !error && (
          <li className="opacity-70">No contributors found.</li>
        )}
      </ul>
    </div>
  );
}
