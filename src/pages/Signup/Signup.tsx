import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, GitBranch, ArrowRight, Check } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface SignUpFormData { username: string; email: string; password: string; }

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const ctx = useContext(ThemeContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${backendUrl}/api/auth/signup`, formData);
      setMessage(res.data.message);
      if (res.data.message === "User created successfully") navigate("/login");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex transition-theme"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 auth-panel-left"
        style={{ width: "42%", flexShrink: 0, backgroundColor: "var(--color-bg-2)", borderRight: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}>
            <GitBranch size={16} strokeWidth={2.5} />
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--color-text)" }}>
            GitHub<span style={{ color: "var(--color-primary)" }}>Tracker</span>
          </span>
        </div>

        <div className="space-y-6">
          {[
            { icon: "01", text: "Track multiple GitHub users simultaneously" },
            { icon: "02", text: "Filter issues and PRs by status, date, and repo" },
            { icon: "03", text: "Privacy-first — no data stored, just public APIs" },
          ].map((item) => (
            <div key={item.icon} className="flex items-start gap-4">
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "12px",
                color: "var(--color-primary)", letterSpacing: "0.08em", paddingTop: "2px",
              }}>
                {item.icon}
              </span>
              <p style={{ fontSize: "15px", color: "var(--color-text-2)", lineHeight: 1.55 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", color: "var(--color-text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          © {new Date().getFullYear()} GitHub Tracker
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="flex items-center justify-center w-7 h-7 rounded" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}>
              <GitBranch size={14} strokeWidth={2.5} />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--color-text)" }}>
              GitHub<span style={{ color: "var(--color-primary)" }}>Tracker</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-text)", marginBottom: "8px" }}>
              Create your account
            </h1>
            <p style={{ color: "var(--color-text-3)", fontSize: "15px" }}>Start tracking GitHub activity in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div>
              <label htmlFor="username" style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}>
                Username
              </label>
              <div className="gt-input-icon">
                <span className="icon"><User size={16} /></span>
                <input
                  id="username" type="text" name="username"
                  autoComplete="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="gt-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}>
                Email address
              </label>
              <div className="gt-input-icon">
                <span className="icon"><Mail size={16} /></span>
                <input
                  id="email" type="email" name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="gt-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <div className="gt-input-icon" style={{ position: "relative" }}>
                <span className="icon"><Lock size={16} /></span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="gt-input"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-3)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password rules */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <Check
                        size={12}
                        style={{ color: r.test(formData.password) ? "var(--color-success)" : "var(--color-text-3)" }}
                      />
                      <span style={{ fontSize: "12px", color: r.test(formData.password) ? "var(--color-success)" : "var(--color-text-3)", fontFamily: "var(--font-body)" }}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className="py-3 px-4 rounded text-sm"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: message.includes("successfully") ? "rgba(25,128,56,0.08)" : "rgba(218,30,40,0.08)",
                  color: message.includes("successfully") ? "var(--color-success)" : "var(--color-error)",
                  border: `1px solid ${message.includes("successfully") ? "rgba(25,128,56,0.2)" : "rgba(218,30,40,0.2)"}`,
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="gt-btn gt-btn-primary w-full flex items-center justify-center gap-2"
              style={{ padding: "13px", fontSize: "15px", opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? "Creating account…" : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--color-text-3)", fontFamily: "var(--font-body)" }}>
              By signing up you agree to our{" "}
              <Link to="/" style={{ color: "var(--color-primary)" }}>Terms of Service</Link>
            </p>
          </form>

          <p style={{ marginTop: "32px", textAlign: "center", fontSize: "14px", color: "var(--color-text-3)", fontFamily: "var(--font-body)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;