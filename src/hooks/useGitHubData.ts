import { useState, useCallback } from "react";
import { searchUserIssuesAndPRs, GitHubSearchItem } from "../../library/githubSearch";

type GhState = "open" | "closed" | "all";


export const useGitHubData = () => {
  const [issues, setIssues] = useState<GitHubSearchItem[]>([]);
  const [prs, setPrs] = useState<GitHubSearchItem[]>([]);
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
    async (
      username: string,
      page = 1,
      perPage = 10,
      state: GhState = "all",
      signal?: AbortSignal
    ) => {
      setLoading(true);
      try {
        const token = readToken();

        // basic param validation
        if (page < 1 || perPage < 1) {
          throw new Error("Invalid pagination parameters");
        }

        // clear old error; handle username/rate-limit UX
        setError("");
        if (!username) {
          setLoading(false);
          return;
        }
        if (rateLimited) {
          setError("Rate limited. Please try again later.");
          setLoading(false);
          return;
        }

        // Abortable requests to avoid setState-on-unmounted
        const internalCtrl = signal ? null : new AbortController();
        const activeSignal = signal ?? internalCtrl!.signal;

        try {
          // Fetch full result sets using robust date-window pagination (bypasses 1000 cap)
          const [allIssues, allPRs] = await Promise.all([
            searchUserIssuesAndPRs({ username, mode: "issues", token, state, signal: activeSignal }),
            searchUserIssuesAndPRs({ username, mode: "prs", token, state, signal: activeSignal }),
          ]);

          // Save totals for pagination controls
          setTotalIssues(allIssues.length);
          setTotalPrs(allPRs.length);

          // Client-side slice to requested page
          const startIdx = Math.max(0, (page - 1) * perPage);
          const endIdx = startIdx + perPage;
          setIssues(allIssues.slice(startIdx, endIdx));
          setPrs(allPRs.slice(startIdx, endIdx));

          // clear rate-limit if we succeeded
          if (rateLimited) setRateLimited(false);
        } finally {
          // Only abort if we created the controller
          if (internalCtrl) internalCtrl.abort();
        }
      } catch (err: unknown) {
        let msg = "Failed to fetch data";
        if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
          msg = (err as any).message as string;
        }
        setError(msg);
        // GitHub returns 403 with specific rate limit message
        if (
          msg.toLowerCase().includes("rate limit") ||
          msg.includes("API rate limit exceeded") ||
          (msg.includes("403") && msg.toLowerCase().includes("limit"))
        ) {
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
