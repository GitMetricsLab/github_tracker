import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface User {
  username: string;
  email: string;
  avatarUrl?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Apply theme from localStorage ----
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;

    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // ---- Fetch user profile ----
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile");
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ---- Loading ----
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );

  // ---- Error ----
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );

  // ---- Empty ----
  if (!user) return null;

  // ---- Main UI ----
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-inherit px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center transition-colors">
        <img
          src={user.avatarUrl || "/profile.svg"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border border-gray-300 dark:border-gray-700"
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {user.username}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>

        <button
          onClick={() => (window.location.href = "/profile/edit")}
          className="mt-6 w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-90 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
