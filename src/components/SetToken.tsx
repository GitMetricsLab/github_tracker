import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import type { ThemeContextType } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { KeyIcon, Eye, EyeOff } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SetToken: React.FC = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;
  const { updateToken } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/token`,
        { token },
        { withCredentials: true }
      );
      if (response.data.success) {
        updateToken(token);
        navigate("/");
      }
    } catch {
      setMessage("Failed to save token. Make sure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen h-full w-full flex items-center justify-center relative overflow-hidden ${
        mode === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100"
      }`}
    >
      <div className="absolute inset-0">
        <div className={`absolute -top-40 -right-40 w-96 h-96 ${mode === "dark" ? "bg-purple-500" : "bg-purple-300"} rounded-full blur-3xl opacity-30 animate-pulse`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${mode === "dark" ? "bg-blue-500" : "bg-blue-300"} rounded-full blur-3xl opacity-30 animate-pulse`} />
      </div>

      <div className="relative w-full max-w-md px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl">
            <KeyIcon className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent mb-2 ${mode === "dark" ? "bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300" : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"}`}>
            GitHub Token
          </h1>
          <p className={`${mode === "dark" ? "text-slate-300" : "text-gray-700"} text-base`}>
            Enter your Personal Access Token to get started
          </p>
        </div>

        <div className={`rounded-3xl p-6 sm:p-10 shadow-2xl border ${mode === "dark" ? "bg-white/10 backdrop-blur-xl border-white/20 text-white" : "bg-white border-gray-200 text-black"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className={`w-full pl-4 pr-12 py-4 rounded-2xl focus:outline-none transition-all ${
                    mode === "dark"
                      ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                      : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowToken((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                    mode === "dark" ? "text-slate-400 hover:text-white" : "text-gray-400 hover:text-gray-700"
                  }`}
                  aria-label={showToken ? "Hide token" : "Show token"}
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className={`mt-2 text-xs ${mode === "dark" ? "text-slate-400" : "text-gray-500"}`}>
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  Generate a new token
                </a>
                {" "}with <code>repo</code> and <code>read:user</code> scopes.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Token"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className={`w-full py-3 px-6 rounded-2xl font-medium transition-all ${mode === "dark" ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              Skip for now
            </button>
          </form>

          {message && (
            <div className="mt-4 p-4 rounded-2xl text-center text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetToken;
