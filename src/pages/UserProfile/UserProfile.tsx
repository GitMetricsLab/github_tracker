import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import toast from "react-hot-toast";
>>>>>>> f00eb9898001de6940350eaf72bd05f9ac76129a

type PR = {
  title: string;
  html_url: string;
  repository_url: string;
};

export default function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!username) return;

<<<<<<< HEAD
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userRes.json();
      setProfile(userData);

      const prsRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
      const prsData = await prsRes.json();
      setPRs(prsData.items);
      setLoading(false);
=======
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        setProfile(userData);

        const prsRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
        const prsData = await prsRes.json();
        setPRs(prsData.items);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
>>>>>>> f00eb9898001de6940350eaf72bd05f9ac76129a
    }

    fetchData();
  }, [username]);

<<<<<<< HEAD
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-xl">
      {profile && (
        <div className="text-center">
          <img src={profile.avatar_url} className="w-24 h-24 mx-auto rounded-full" />
          <h2 className="text-2xl font-bold mt-2">{profile.login}</h2>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">Pull Requests</h3>
      <ul className="list-disc ml-6 space-y-2">
        {prs.map((pr, i) => (
          <li key={i}>
            <a href={pr.html_url} target="_blank" className="text-blue-600 hover:underline">
              {pr.title}
            </a>
          </li>
        ))}
      </ul>
=======
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("🔗 Shareable link copied to clipboard!");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!profile) return <div className="text-center mt-10 text-red-600">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-xl">
      <div className="text-center">
        <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 mx-auto rounded-full" />
        <h2 className="text-2xl font-bold mt-2">{profile.login}</h2>
        <p className="text-gray-600">{profile.bio}</p>
        <button
          onClick={handleCopyLink}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
                  className="text-blue-600 hover:underline"
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
>>>>>>> f00eb9898001de6940350eaf72bd05f9ac76129a
    </div>
  );
}
