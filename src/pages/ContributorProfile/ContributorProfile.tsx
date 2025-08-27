import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { searchUserIssuesAndPRs, GitHubSearchItem } from "../../../library/githubSearch";

// Minimal shape from the GitHub Users API we actually render
type GitHubUser = {
  login: string;
  avatar_url: string;
  bio?: string | null;
};

export default function ContributorProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<GitHubUser | null>(null);
  const [prs, setPRs] = useState<GitHubSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let canceled = false;
    let toastId: string | undefined;

    async function fetchData() {
      if (!username) {
        setLoading(false);
        setErrorMsg("No username provided.");
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      toastId = toast.loading("Fetching PRs…");

      try {
        const isDev = import.meta.env.DEV;
        const token = isDev ? (import.meta.env.VITE_GITHUB_TOKEN as string | undefined) : undefined;

        // Fetch user profile (authorized if token exists)
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Accept: "application/vnd.github+json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "X-GitHub-Api-Version": "2022-11-28",
          },
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (!userRes.ok) {
          if (userRes.status === 404) {
            setProfile(null);
            throw new Error("User not found");
          }
          if (userRes.status === 403) {
            const rem = userRes.headers.get("x-ratelimit-remaining");
            const msg =
              rem === "0"
                ? "GitHub API rate limit exceeded. Please try again later."
                : "Access forbidden. If in development, set VITE_GITHUB_TOKEN.";
            throw new Error(msg);
          }
          throw new Error(`Failed to fetch user: ${userRes.status}`);
        }
        const userData = await userRes.json();
        if (canceled) return;
        setProfile(userData as GitHubUser);

        // Robust PR fetch: replaced with searchUserIssuesAndPRs
        const prItems = await searchUserIssuesAndPRs({
          username,
          mode: "prs",
          state: "all",
          token,
          signal: controller.signal,
        });
        if (canceled) return;
        setPRs([...prItems].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      } catch (error) {
        // Ignore expected aborts (navigation/unmount)
        if (canceled || (error as any)?.name === "AbortError") {
          return;
        }
        console.error(error);
        const msg = error instanceof Error ? error.message : "Failed to fetch user data.";
        setErrorMsg(msg);
        toast.error(msg);
      } finally {
        if (toastId) toast.dismiss(toastId);
        if (!controller.signal.aborted && !canceled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
      canceled = true;
      if (toastId) {
        toast.dismiss(toastId);
        toastId = undefined;
      }
    };
  }, [username]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        // Fallback for older browsers
        const el = document.createElement("textarea");
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      toast.success("🔗 Shareable link copied to clipboard!");
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-600">
        {errorMsg ?? "User not found."}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-2 mb-2 p-4 bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-xl">
      <div className="text-center">
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className="w-24 h-24 mx-auto rounded-full"
        />
        <h2 className="text-2xl font-bold mt-2">{profile.login}</h2>
        <p className="">{profile.bio ?? ""}</p>
        <button
          onClick={handleCopyLink}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-800 transition text-white"
        >
          Copy Shareable Link
        </button>
      </div>

      {errorMsg ? (
        <div className="mt-4 mb-2 rounded border border-red-300 bg-red-50 text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300 px-3 py-2">
          {errorMsg}
        </div>
      ) : null}

      <h3 className="text-xl font-semibold mt-6 mb-2">Pull Requests</h3>
      {prs.length > 0 ? (
        <ul className="list-disc ml-6 space-y-2">
          {prs.map((pr) => {
            const repoName = (() => {
              if (!pr.repository_url) return "unknown";
              try {
                const url = new URL(pr.repository_url);
                const parts = url.pathname.split("/").filter(Boolean);
                return parts.slice(-2).join("/");
              } catch {
                return "unknown";
              }
            })();
            return (
              <li key={pr.id}>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline"
                >
                  {`[${repoName}] ${pr.title}`}
                  {pr.pull_request?.merged_at ? (
                    <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-green-600/20 text-green-700 dark:text-green-300">merged</span>
                  ) : pr.state === "closed" ? (
                    <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-gray-500/20 text-gray-700 dark:text-gray-300">closed</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600">No pull requests found for this user.</p>
      )}
    </div>
  );
}
