import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import AuthShell from "../../components/AuthShell";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  const highlights = [
    {
      title: "Quick setup",
      description: "Create a profile in minutes and start organizing your GitHub activity right away.",
    },
    {
      title: "Built-in validation",
      description: "Clear feedback helps users enter a valid name, email, and stronger password from the start.",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    let errorMessage = "";
    if (name === "username") {
      if (!value.trim()) {
        errorMessage = "Username is required";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        errorMessage = "Only letters are allowed";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        errorMessage = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        errorMessage = "Enter a valid email";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        errorMessage = "Password is required";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
        errorMessage = "Password must contain uppercase, lowercase, number, and special character";
      }
    }

    setErrors((previous) => ({ ...previous, [name]: errorMessage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = !formData.username.trim()
      ? "Username is required"
      : !/^[A-Za-z\s]+$/.test(formData.username)
        ? "Only letters are allowed"
        : "";
    const emailError = !formData.email.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ? "Enter a valid email"
        : "";
    const passwordError = !formData.password.trim()
      ? "Password is required"
      : !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.password)
        ? "Password must be 8+ characters with letters and numbers"
        : "";

    if (usernameError || emailError || passwordError) {
      setErrors({ username: usernameError, email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, formData, { withCredentials: true });
      setMessage(response.data.message);

      if (response.data.message === "User created successfully") {
        navigate("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      mode={mode}
      badge="Start here"
      title="Create your GitHubTracker account"
      subtitle="Set up your profile once, then use the tracker, discussions, and contributor tools with a consistent sign-in."
      highlights={highlights}
      footer={
        <p className={`text-center text-sm ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Already have an account?
          <Link to="/login" className="ml-1 font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
            Sign in instead
          </Link>
        </p>
      }
    >
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/90">
            <Sparkles className="h-3.5 w-3.5" />
            New account
          </div>
          <div>
            <h2 className={`text-3xl font-semibold tracking-tight ${mode === "dark" ? "text-white" : "text-slate-950"}`}>
              Build your profile
            </h2>
            <p className={`mt-2 text-sm leading-6 ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Use a simple, guided signup flow with instant feedback while you type.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className={`text-sm font-medium ${mode === "dark" ? "text-slate-200" : "text-slate-700"}`}>Username</span>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2 ${mode === "dark" ? "border-white/10 bg-white/5 focus-within:ring-cyan-400/50" : "border-slate-200 bg-slate-50 focus-within:ring-cyan-500/30"}`}>
              <User className={`h-5 w-5 shrink-0 ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type="text"
                name="username"
                placeholder="Your display name"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full bg-transparent text-sm outline-none ${mode === "dark" ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
              />
            </div>
            {errors.username && <p className="text-sm text-rose-600 dark:text-rose-300">{errors.username}</p>}
          </label>

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
                required
                className={`w-full bg-transparent text-sm outline-none ${mode === "dark" ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
              />
            </div>
            {errors.email && <p className="text-sm text-rose-600 dark:text-rose-300">{errors.email}</p>}
          </label>

          <label className="block space-y-2">
            <span className={`text-sm font-medium ${mode === "dark" ? "text-slate-200" : "text-slate-700"}`}>Password</span>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2 ${mode === "dark" ? "border-white/10 bg-white/5 focus-within:ring-cyan-400/50" : "border-slate-200 bg-slate-50 focus-within:ring-cyan-500/30"}`}>
              <Lock className={`h-5 w-5 shrink-0 ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full bg-transparent text-sm outline-none ${mode === "dark" ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className={`shrink-0 transition-colors ${mode === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-rose-600 dark:text-rose-300">{errors.password}</p>}
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {message && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              message.includes("successfully")
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

export default SignUp;
