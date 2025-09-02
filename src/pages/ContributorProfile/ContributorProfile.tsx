import { ghFetch as gh } from "../../lib/githubFetch";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Profile = {
  login: string;
  avatar_url: string;
  bio?: string | null;
  html_url: string;
};

type PR = {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
};

export default function ContributorProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!username) return;

      const token =
        localStorage.getItem("gh_pat") ||
        localStorage.getItem("github_pat") ||
        localStorage.getItem("token") ||
        "";

      try {
        // fetch user profile
        const userRes = await gh(`/users/${encodeURIComponent(username)}`, token);
        if (!userRes.ok) {
          if (userRes.status === 404) {
            // user not found — clear state and bail early
            setProfile(null);
            setPRs([]);
            return;
          }
          const msg = await userRes.text().catch(() => "");
          throw new Error(
            `User fetch failed: ${userRes.status} ${userRes.statusText}${
              msg ? ` – ${msg}` : ""
            }`
          );
        }
        const userData = (await userRes.json()) as Profile;
        setProfile(userData);

        // fetch PRs authored by the user (latest first) using GraphQL
        const gqlQuery = {
          query: `
            query($query: String!) {
              search(query: $query, type: ISSUE, first: 100) {
                nodes {
                  ... on PullRequest {
                    id
                    title
                    url
                    repository {
                      nameWithOwner
                    }
                  }
                }
              }
            }
          `,
          variables: {
            query: `author:${username} type:pr sort:updated-desc`,
          },
        };

        const prsRes = await gh("/graphql", token, {
          method: "POST",
          body: JSON.stringify(gqlQuery),
        });

        if (!prsRes.ok) {
          const msg = await prsRes.text().catch(() => "");
          throw new Error(
            `PR search failed: ${prsRes.status} ${prsRes.statusText}${
              msg ? ` – ${msg}` : ""
            }`
          );
        }

        const prsData = await prsRes.json();
        const prs = prsData.data?.search?.nodes || [];
        setPRs(prs as PR[]);
      } catch (error: any) {
        toast.error(`Failed to fetch user data. ${error?.message ?? ""}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("🔗 Shareable link copied to clipboard!");
    } catch {
      toast.error("Could not copy link");
    }
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
          alt={`${profile.login} avatar`}
          className="w-24 h-24 mx-auto rounded-full"
        />
        <h2 className="text-2xl font-bold mt-2">
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {profile.login}
          </a>
        </h2>
        {profile.bio && <p className="mt-1 opacity-90">{profile.bio}</p>}
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
            const repoName = pr.repository_url.split("/").slice(-2).join("/");
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
