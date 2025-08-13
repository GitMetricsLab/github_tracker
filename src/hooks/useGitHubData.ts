import { useState, useCallback } from "react";
import { searchUserIssuesAndPRs } from "../../library/githubSearch";

type GhState = "open" | "closed" | "all";


export const useGitHubData = (_getOctokit: () => any) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  // Prefer user env (Vite), but work without it too
  const readToken = (): string | undefined => {
    try {
      // Vite exposes env under import.meta.env
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const env = (import.meta as any)?.env as Record<string, string> | undefined;
      return env?.VITE_GITHUB_TOKEN || undefined;
    } catch {
      return undefined;
    }
  };

  const fetchData = useCallback(
    async (username: string, page = 1, perPage = 10, state: GhState = "all") => {
      if (!username || rateLimited) return;

      setLoading(true);
      setError("");

      try {
        const token = readToken();

        // Fetch full result sets using robust date-window pagination (bypasses 1000 cap)
        const [allIssues, allPRs] = await Promise.all([
          searchUserIssuesAndPRs({ username, mode: "issues", token, state }),
          searchUserIssuesAndPRs({ username, mode: "prs", token, state }),
        ]);

        // Save totals for pagination controls
        setTotalIssues(allIssues.length);
        setTotalPrs(allPRs.length);

        // Client-side slice to requested page
        const startIdx = Math.max(0, (page - 1) * perPage);
        const endIdx = startIdx + perPage;
        setIssues(allIssues.slice(startIdx, endIdx));
        setPrs(allPRs.slice(startIdx, endIdx));
      } catch (err: any) {
        const msg = typeof err?.message === "string" ? err.message : "Failed to fetch data";
        setError(msg);
        if (msg.toLowerCase().includes("rate limit") || msg.includes("403")) {
          setRateLimited(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [rateLimited]
  );

  return {
    issues,
    prs,
    totalIssues,
    totalPrs,
    loading,
    error,
    fetchData,
  };
};

export default useGitHubData;
