import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import AuthShell from "../../components/AuthShell";
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
    <AuthShell
      mode={mode}
      badge="Welcome back"
      title="Sign in to GitHubTracker"
      subtitle="Pick up where you left off and keep tracking the people, repositories, and discussions that matter to you."
      highlights={highlights}
      footer={
        <p className={`text-center text-sm ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Don't have an account?
          <Link to="/signup" className="ml-1 font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
            Create one now
          </Link>
        </p>
      }
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
                className={`w-full bg-transparent text-sm outline-none ${mode === "dark" ? "placeholder-slate-500 text-white" : "placeholder-slate-400 text-slate-900"}`}
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full bg-transparent text-sm outline-none ${mode === "dark" ? "placeholder-slate-500 text-white" : "placeholder-slate-400 text-slate-900"}`}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {message && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              message === "Login successful"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            }`}
          >
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{message}</p>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
};

export default Login;