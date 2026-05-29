import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";
import { KeyIcon, UserIcon, CheckCircle, Eye, EyeOff, LogOut } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile: React.FC = () => {
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;
  const { user, updateToken, setUser } = useUser();
  const navigate = useNavigate();

  const [token, setToken] = useState(user?.token ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showToken, setShowToken] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/api/auth/logout`, { withCredentials: true });
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSaved(false);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/token`,
        { token },
        { withCredentials: true }
      );
      if (response.data.success) {
        updateToken(token);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Failed to save token.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const inputClass = `w-full pl-4 pr-4 py-3 rounded-xl focus:outline-none transition-all ${
    mode === "dark"
      ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
      : "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
  }`;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-10">
      <h1 className={`text-2xl font-bold mb-8 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
        Profile
      </h1>

      {/* Username */}
      <div className={`rounded-2xl p-6 mb-4 border ${mode === "dark" ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} shadow-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="w-4 h-4 text-purple-500" />
          <span className={`text-sm font-semibold ${mode === "dark" ? "text-slate-300" : "text-gray-600"}`}>Username</span>
        </div>
        <input
          type="text"
          value={user.username}
          readOnly
          className={`${inputClass} opacity-60 cursor-not-allowed`}
        />
      </div>

      {/* Logout */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] ${
            mode === "dark"
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-red-50 border border-red-200 text-red-500 hover:bg-red-100"
          }`}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* GitHub Token */}
      <div className={`rounded-2xl p-6 border ${mode === "dark" ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} shadow-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <KeyIcon className="w-4 h-4 text-purple-500" />
          <span className={`text-sm font-semibold ${mode === "dark" ? "text-slate-300" : "text-gray-600"}`}>GitHub Personal Access Token</span>
        </div>
        <form onSubmit={handleSaveToken} className="space-y-4">
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowToken((v) => !v)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                mode === "dark" ? "text-slate-400 hover:text-white" : "text-gray-400 hover:text-gray-700"
              }`}
              aria-label={showToken ? "Hide token" : "Show token"}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className={`text-xs ${mode === "dark" ? "text-slate-400" : "text-gray-500"}`}>
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              Generate a token
            </a>
            {" "}with <code>repo</code> and <code>read:user</code> scopes.
          </p>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved
              </>
            ) : isLoading ? (
              "Saving..."
            ) : (
              "Save Token"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
