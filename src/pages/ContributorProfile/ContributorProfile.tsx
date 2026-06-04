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
  bio: string | null;
};

const isProfile = (data: unknown): data is Profile => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as any).avatar_url === "string" &&
    typeof (data as any).login === "string" &&
    (typeof (data as any).bio === "string" || (data as any).bio === null)
  );
};

const isPrArray = (data: unknown): data is PR[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as any).title === "string" &&
        typeof (item as any).html_url === "string" &&
        typeof (item as any).repository_url === "string"
    )
  );
};

export default function ContributorProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!username) {
        setError("No username provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) {
          if (userRes.status === 404) {
            throw new Error("User not found.");
          }
          if (userRes.status === 403) {
            throw new Error("GitHub API rate limit exceeded. Please try again later.");
          }
          throw new Error(`GitHub user fetch failed with status ${userRes.status}.`);
        }

        const userData = await userRes.json();
        if (!isProfile(userData)) {
          throw new Error("Invalid GitHub profile response.");
        }
        setProfile(userData);

        const prsRes = await fetch(
          `https://api.github.com/search/issues?q=author:${username}+type:pr`
        );
        if (!prsRes.ok) {
          if (prsRes.status === 403) {
            throw new Error("GitHub API rate limit exceeded. Please try again later.");
          }
          throw new Error(`GitHub PR fetch failed with status ${prsRes.status}.`);
        }

        const prsData = await prsRes.json();
        if (
          typeof prsData !== "object" ||
          prsData === null ||
          !Array.isArray((prsData as any).items) ||
          !isPrArray((prsData as any).items)
        ) {
          throw new Error("Invalid GitHub PR response.");
        }

        setPRs((prsData as any).items);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch user data.";
        setError(message);
        toast.error(message);
        setProfile(null);
        setPRs([]);
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

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">{error}</div>
    );

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
