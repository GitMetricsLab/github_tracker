import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { searchUserIssuesAndPRs } from "../../../library/githubSearch";

export default function ContributorProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [prs, setPRs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    let toastId: string | undefined;

    async function fetchData() {
      if (!username) return;

      setLoading(true);
      toastId = toast.loading("Fetching PRs…");

      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

        // Fetch user profile (authorized if token exists)
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Accept: "application/vnd.github+json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        if (!userRes.ok) {
          throw new Error(`Failed to fetch user: ${userRes.status}`);
        }
        const userData = await userRes.json();
        if (canceled) return;
        setProfile(userData);

        // Robust PR fetch: replaced with searchUserIssuesAndPRs
        const prItems = await searchUserIssuesAndPRs({
          username,
          mode: "prs",
          state: "all",
          token,
        });
        if (canceled) return;
        setPRs(prItems);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data.");
      } finally {
        if (toastId) toast.dismiss(toastId);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      canceled = true;
      if (toastId) toast.dismiss(toastId);
    };
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("🔗 Shareable link copied to clipboard!");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!profile)
    return (
      <div className="text-center mt-10 text-red-600">User not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-2 mb-2 p-4 bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-xl">
      <div className="text-center">
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className="w-24 h-24 mx-auto rounded-full"
        />
        <h2 className="text-2xl font-bold mt-2">{profile.login}</h2>
        <p className="">{profile.bio}</p>
        <button
          onClick={handleCopyLink}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-800 transition text-white"
        >
          Copy Shareable Link
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Pull Requests</h3>
      {prs.length > 0 ? (
        <ul className="list-disc ml-6 space-y-2">
          {prs.map((pr) => {
            const repoName = pr.repository_url?.split("/").slice(-2).join("/") ?? "";
            return (
              <li key={pr.id}>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline"
                >
                  [{repoName}] {pr.title}
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
