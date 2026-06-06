import React, { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";
import {
  authApi,
  fetchOAuthProviders,
  getOAuthLoginUrl,
  type OAuthProviders,
} from "../../utils/authApi";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [oauthProviders, setOauthProviders] = useState<OAuthProviders>({
    google: false,
    github: false,
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  useEffect(() => {
    fetchOAuthProviders()
      .then(setOauthProviders)
      .catch(() => setOauthProviders({ google: false, github: false }));
  }, []);

  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");
    const oauthMessage = searchParams.get("message");

    if (oauthStatus === "success") {
      setMessage("Login successful");
      setSearchParams({}, { replace: true });
      navigate("/");
      return;
    }

    if (oauthStatus === "error") {
      setMessage(oauthMessage ? decodeURIComponent(oauthMessage) : "OAuth sign-in failed");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    if (!oauthProviders[provider]) {
      const envKeys =
        provider === "google"
          ? "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
          : "GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET";
      setMessage(`${provider} sign-in is not configured yet. Add ${envKeys} to backend/.env and restart the server.`);
      return;
    }
    window.location.href = getOAuthLoginUrl(provider);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.post("/login", formData);
      setMessage(response.data.message);

      if (response.data.message === "Login successful") {
        navigate("/");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Something went wrong");
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccessMessage = message === "Login successful";
  const isOAuthSetupMessage = message.includes("not configured yet");

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
        <div className={`absolute top-40 left-40 w-96 h-96 ${mode === "dark" ? "bg-pink-500" : "bg-pink-300"} rounded-full blur-3xl opacity-30 animate-pulse`} />
        <div className={`absolute top-1/2 right-1/4 w-64 h-64 ${mode === "dark" ? "bg-indigo-500" : "bg-indigo-300"} rounded-full blur-2xl opacity-20 animate-pulse delay-1000`} />
      </div>

      <div className="relative w-full max-w-md px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img src="/crl-icon.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>

          <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${
            mode === "dark"
              ? "bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300"
              : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
          }`}>
            GitHubTracker
          </h1>
          <p className={`${mode === "dark" ? "text-slate-300" : "text-gray-700"} text-lg font-medium`}>
            Track your GitHub journey
          </p>
        </div>

        <div className={`rounded-3xl p-6 sm:p-10 shadow-2xl border ${mode === "dark" ? "bg-white/10 backdrop-blur-xl border-white/20 text-white" : "bg-white border-gray-200 text-black"}`}>
          <h2 className={`text-2xl font-bold text-center mb-8 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
            Welcome Back
          </h2>

          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-semibold border transition-all duration-300 hover:scale-[1.02] ${
                mode === "dark"
                  ? "bg-white/5 border-white/20 hover:bg-white/10"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <FaGoogle className="text-[#EA4335]" size={20} />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-semibold border transition-all duration-300 hover:scale-[1.02] ${
                mode === "dark"
                  ? "bg-white/5 border-white/20 hover:bg-white/10"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <FaGithub size={20} />
              Continue with GitHub
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className={`flex-1 h-px ${mode === "dark" ? "bg-white/20" : "bg-gray-300"}`} />
              <span className={`text-xs uppercase tracking-wide ${mode === "dark" ? "text-slate-400" : "text-gray-500"}`}>
                or sign in with email
              </span>
              <div className={`flex-1 h-px ${mode === "dark" ? "bg-white/20" : "bg-gray-300"}`} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                required
                className={`w-full pl-4 pr-4 py-4 rounded-2xl focus:outline-none transition-all ${
                  mode === "dark"
                    ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                }`}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-4 pr-4 py-4 rounded-2xl focus:outline-none transition-all ${
                  mode === "dark"
                    ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${
              isSuccessMessage
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : isOAuthSetupMessage
                  ? mode === "dark"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "bg-amber-50 text-amber-800 border border-amber-300"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}>
              {message}
            </div>
          )}

          <div className="text-center mt-8 pb-8">
            <p className={`${mode === "dark" ? "text-slate-500" : "text-gray-600"} text-sm`}>
              Don&apos;t have an account?
              <Link
                to="/signup"
                className="ml-1 text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={`${mode === "dark" ? "from-slate-900" : "from-slate-100"} absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t to-transparent`} />
    </div>
  );
};

export default Login;
