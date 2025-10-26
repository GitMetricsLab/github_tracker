import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null;

  const { username, token, setUsername, setToken } = auth;

  const [localUsername, setLocalUsername] = useState(username || "");
  const [localToken, setLocalToken] = useState(token || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(localUsername);
    setToken(localToken);
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 dark:text-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">GitHub Username</label>
          <input
            className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
            value={localUsername}
            onChange={(e) => setLocalUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Personal Access Token</label>
          <input
            className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
            value={localToken}
            onChange={(e) => setLocalToken(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
