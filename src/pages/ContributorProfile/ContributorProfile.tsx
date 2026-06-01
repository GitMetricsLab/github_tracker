import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type PR = {
  title: string;
  html_url: string;
  repository_url: string;
};

type Profile = {
  avatar_url: string;
  login: string;
  bio: string;
};

// --- FIX: Added separate error type to distinguish 404 vs other failures ---
type ErrorType = "not_found" | "api_error" | null;

export default function ContributorProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  // --- FIX: New error state ---
  const [error, setError] = useState<ErrorType>(null);

  useEffect(() => {
    async function fetchData() {
      if (!username) return;

      // --- FIX: Reset error on each fetch ---
      setError(null);

      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);

        if (!userRes.ok) {
          if (userRes.status === 404) {
            // --- FIX: 404 → "not_found", not a generic error ---
            setError("not_found");
          } else {
            // --- FIX: Rate limit, server error, etc. → "api_error" ---
            setError("api_error");
          }
          setProfile(null);
          setPRs([]);
          return;
        }

        const userData = await userRes.json();
        setProfile(userData);

        const prsRes = await fetch(
          `https://api.github.com/search/issues?q=author:${username}+type:pr`
        );
        if (!prsRes.ok) {
          setPRs([]);
          toast.error("Failed to load pull requests.");
        } else {
          const prsData = await prsRes.json();
          setPRs(prsData.items ?? []);
        }
      } catch {
        // --- FIX: Network/connection failures → "api_error" ---
        setError("api_error");
        setProfile(null);
        setPRs([]);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("🔗 Shareable link copied to clipboard!");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // --- FIX: Show correct message based on error type ---
  if (error === "not_found") {
    return (
      <div className="text-center mt-10 text-red-600">
        User not found.
      </div>
    );
  }

  if (error === "api_error") {
    return (
      <div className="text-center mt-10 text-yellow-600">
        Unable to load contributor profile. Please try again later.
      </div>
    );
  }

  if (!profile) return null;

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
          {prs.map((pr, i) => {
            const repoName = pr.repository_url.split("/").slice(-2).join("/");
            return (
              <li key={i}>
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