import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userRes.json();
      setProfile(userData);

      const prsRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
      const prsData = await prsRes.json();
      setPRs(prsData.items);
      setLoading(false);
    }

    fetchData();
  }, [username]);

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
    </div>
  );
}
