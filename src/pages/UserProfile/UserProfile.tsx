import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";

type PR = {
  title: string;
  html_url: string;
  repository_url: string;
};

export default function UserProfile() {
  const { username: paramUsername } = useParams();
  const location = useLocation();
  const { username: loggedInUsername, token } = useGitHubAuth();
  const [profile, setProfile] = useState<any>(null);
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const isEdit = new URLSearchParams(location.search).get("edit") === "1";
  const isOwnProfile = paramUsername === loggedInUsername;
  const maxBioLength = 160;

  useEffect(() => {
    async function fetchData() {
      if (!paramUsername) return;
      const userRes = await fetch(`https://api.github.com/users/${paramUsername}`);
      const userData = await userRes.json();
      setProfile(userData);
      setEditBio(userData.bio || "");
      const prsRes = await fetch(`https://api.github.com/search/issues?q=author:${paramUsername}+type:pr`);
      const prsData = await prsRes.json();
      setPRs(prsData.items);
      setLoading(false);
    }
    fetchData();
  }, [paramUsername]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    await fetch("https://api.github.com/user", {
      method: "PATCH",
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio: editBio }),
    });
    setSaving(false);
    window.location.href = `/user/${paramUsername}`;
  };

  const handleCancel = () => {
    setEditBio(profile.bio || "");
    setEditMode(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-2xl p-8 max-w-xl mx-auto mt-16">
      {profile && (
        <div className="flex flex-col items-center w-full">
          <div className="relative group">
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg transition-transform group-hover:scale-105"
            />
            {isOwnProfile && !isEdit && (
              <span className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg cursor-pointer" title="Edit Profile" onClick={() => window.location.href = `/user/${paramUsername}?edit=1`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" />
                </svg>
              </span>
            )}
          </div>
          <h2 className="text-3xl font-bold mt-4">{profile.login}</h2>
          {isEdit && isOwnProfile ? (
            <div className="mt-4 w-full">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-gray-700 mr-2">Bio</span>
                <span className="text-xs text-gray-400">({editBio.length}/{maxBioLength})</span>
              </div>
              <textarea
                className="w-full border-2 border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-base resize-none shadow"
                rows={3}
                maxLength={maxBioLength}
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                placeholder="Edit your bio"
              />
              <div className="flex gap-3 mt-3">
                <button
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Bio"}
                </button>
                <button
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full shadow transition"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-700 mt-4 text-center max-w-md">{profile.bio || <span className="italic text-gray-400">No bio provided.</span>}</p>
          )}
        </div>
      )}
      <h3 className="text-2xl font-semibold mt-10 mb-4 w-full text-left">Pull Requests</h3>
      <div className="grid grid-cols-1 gap-4 w-full">
        {prs.length === 0 && <div className="text-gray-400 italic">No pull requests found.</div>}
        {prs.map((pr, i) => (
          <div key={i} className="bg-white rounded-xl shadow flex flex-col md:flex-row items-start md:items-center p-4 border border-gray-100 hover:shadow-lg transition">
            <div className="flex-1">
              <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline text-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                {pr.title}
              </a>
              <div className="text-sm text-gray-500 mt-1">{pr.repository_url.split("/").pop()}</div>
            </div>
            <span className="ml-0 md:ml-4 mt-2 md:mt-0 inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">PR</span>
          </div>
        ))}
      </div>
    </div>
  );
}
