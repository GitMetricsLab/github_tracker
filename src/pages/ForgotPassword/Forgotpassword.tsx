import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, GitBranch, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 py-12 transition-theme"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-12">
          <span
            className="flex items-center justify-center w-7 h-7 rounded"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}
          >
            <GitBranch size={14} strokeWidth={2.5} />
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--color-text)" }}>
            GitHub<span style={{ color: "var(--color-primary)" }}>Tracker</span>
          </span>
        </Link>

        {!submitted ? (
          <>
            <div className="mb-8">
              <Link
                to="/login"
                className="flex items-center gap-1.5 mb-6"
                style={{ color: "var(--color-text-3)", fontSize: "13px", fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
              <h1 style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-text)", marginBottom: "8px" }}>
                Reset your password
              </h1>
              <p style={{ color: "var(--color-text-3)", fontSize: "15px" }}>
                Enter your email address and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="reset-email"
                  style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}
                >
                  Email address
                </label>
                <div className="gt-input-icon">
                  <span className="icon"><Mail size={16} /></span>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="gt-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="gt-btn gt-btn-primary w-full flex items-center justify-center gap-2"
                style={{ padding: "13px", fontSize: "15px", opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Sending link…" : (
                  <>Send reset link <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p style={{ marginTop: "32px", textAlign: "center", fontSize: "14px", color: "var(--color-text-3)", fontFamily: "var(--font-body)" }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-8">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-6"
              style={{ backgroundColor: "rgba(25,128,56,0.1)" }}
            >
              <CheckCircle size={28} style={{ color: "var(--color-success)" }} />
            </div>
            <h1 style={{ fontSize: "24px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-text)", marginBottom: "12px" }}>
              Check your inbox
            </h1>
            <p style={{ color: "var(--color-text-2)", fontSize: "15px", marginBottom: "32px", lineHeight: 1.65 }}>
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="gt-btn gt-btn-outline" style={{ padding: "10px 24px" }}>
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;