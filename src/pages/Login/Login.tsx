import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const authContext = useContext(AuthContext);
  const { mode } = themeContext;

  const highlights = [
    {
      title: "Fast access",
      description: "Jump back into your tracker, dashboards, and community activity in one step.",
    },
    {
      title: "Secure session",
      description: "Signed-in sessions use the same backend cookie flow your app already relies on.",
    },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, formData, { withCredentials: true });
      setMessage(response.data.message);

      if (response.data.message === 'Login successful') {
        if (typeof window !== "undefined" && response.data.user) {
          window.localStorage.setItem("github_tracker_auth_user", JSON.stringify(response.data.user));
        }
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

  return (
    <div
      className={`min-h-screen h-full w-full flex items-center justify-center relative overflow-hidden ${mode === "dark"
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100"
        }`}
    >
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/90">
            <Sparkles className="h-3.5 w-3.5" />
            Secure login
          </div>
          <div>
            <h2 className={`text-3xl font-semibold tracking-tight ${mode === "dark" ? "text-white" : "text-slate-950"}`}>
              Welcome back
            </h2>
            <p className={`mt-2 text-sm leading-6 ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Enter your credentials to continue to your dashboard.
            </p>
          </div>

          <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${mode === "dark"
            ? "bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300"
            : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
            }`}>
            GitHubTracker
          </h1>
          <p className={`${mode === "dark" ? "text-slate-300" : "text-gray-700"} text-lg font-medium`}>
            Track your GitHub journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className={`text-sm font-medium ${mode === "dark" ? "text-slate-200" : "text-slate-700"}`}>Email address</span>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2 ${mode === "dark" ? "border-white/10 bg-white/5 focus-within:ring-cyan-400/50" : "border-slate-200 bg-slate-50 focus-within:ring-cyan-500/30"}`}>
              <Mail className={`h-5 w-5 shrink-0 ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                required
                className={`w-full pl-4 pr-4 py-4 rounded-2xl focus:outline-none transition-all ${mode === "dark"
                  ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                  : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                  }`}
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className={`text-sm font-medium ${mode === "dark" ? "text-slate-200" : "text-slate-700"}`}>Password</span>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2 ${mode === "dark" ? "border-white/10 bg-white/5 focus-within:ring-cyan-400/50" : "border-slate-200 bg-slate-50 focus-within:ring-cyan-500/30"}`}>
              <Lock className={`h-5 w-5 shrink-0 ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-4 pr-4 py-4 rounded-2xl focus:outline-none transition-all ${mode === "dark"
                  ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                  : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                  }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full border-2 py-4 px-6 rounded-2xl font-semibold shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${mode === "dark"
                  ? "bg-slate-900 text-white border-pink-400 focus:ring-4 focus:ring-pink-500/20 hover:bg-slate-800 hover:shadow-md"
                  : "bg-slate-100 text-slate-900 border-pink-300 focus:ring-4 focus:ring-pink-200 hover:bg-slate-200 hover:shadow-md"
                }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${message === "Login successful"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
              {message}
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
};

export default Login;