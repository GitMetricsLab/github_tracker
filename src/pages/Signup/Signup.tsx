import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Username rules -- must mirror backend/validators/authValidator.js exactly.
// Accepted characters: letters (a-z, A-Z), digits (0-9), and underscores.
// Length: minimum 3, maximum 30 characters.
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const USERNAME_ERROR = "Username can only contain letters, numbers, and underscores";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    let errorMessage = "";
    if (name === "username") {
      if (!value.trim()) {
        errorMessage = "Username is required";
      } else if (value.trim().length < USERNAME_MIN) {
        errorMessage = `Username must be at least ${USERNAME_MIN} characters long`;
      } else if (value.trim().length > USERNAME_MAX) {
        errorMessage = `Username must be at most ${USERNAME_MAX} characters long`;
      } else if (!USERNAME_REGEX.test(value.trim())) {
        errorMessage = USERNAME_ERROR;
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
      } else if (!PASSWORD_REGEX.test(value)) {
        errorMessage = PASSWORD_ERROR;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = formData.username.trim();
    const usernameError = !trimmedUsername
      ? "Username is required"
      : trimmedUsername.length < USERNAME_MIN
      ? `Username must be at least ${USERNAME_MIN} characters long`
      : trimmedUsername.length > USERNAME_MAX
      ? `Username must be at most ${USERNAME_MAX} characters long`
      : !USERNAME_REGEX.test(trimmedUsername)
      ? USERNAME_ERROR
      : "";
    const emailError = !formData.email.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ? "Enter a valid email"
      : "";
    const passwordError = !formData.password.trim()
      ? "Password is required"
      : !PASSWORD_REGEX.test(formData.password)
      ? PASSWORD_ERROR
      : "";
    if (usernameError || emailError || passwordError) {
      setErrors({ username: usernameError, email: emailError, password: passwordError });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, formData, {
        withCredentials: true,
      });
      setMessage(response.data.message); // Show success message from backend

      // Navigate to login page after successful signup
      if (response.data.message === 'User created successfully') {
        navigate("/login");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rp-root">
        <div className="rp-card">
          <div className="rp-hero">
            <div className="rp-hero-orb" />
            <div className="rp-brand">
              <div className="rp-brand-icon">
                <img src="crl.png" alt="logo" width={20} height={20} />
              </div>
              <span className="rp-brand-name">GitHub Tracker</span>
            </div>
            <div className="rp-hero-label">Welcome to</div>
            <div className="rp-hero-title">Your new<br/>workspace</div>
            <div className="rp-hero-sub">Create your account and start building something great today.</div>
            <div className="rp-hero-dots">
              <div className="rp-dot active" />
              <div className="rp-dot" />
              <div className="rp-dot" />
            </div>
          </div>

          {success ? (
            <div className="rp-success">
              <div className="rp-success-icon"><IconCheck /></div>
              <div className="rp-success-title">Account created!</div>
              <div className="rp-success-sub">Welcome to GitHub Tracker, {form.firstName}.<br/>Check your email to verify your account.</div>
            </div>
          ) : (
            <div className="rp-form">
              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label">First name</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><IconUser /></span>
                    <input
                      className="rp-input"
                      type="text"
                      placeholder="Jane"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                    />
                  </div>
                  {errors.firstName && <span className="rp-error">{errors.firstName}</span>}
                </div>
                <div className="rp-field">
                  <label className="rp-label">Last name</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><IconUser /></span>
                    <input
                      className="rp-input"
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                    />
                  </div>
                  {errors.lastName && <span className="rp-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label">Email address</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon"><IconMail /></span>
                  <input
                    className="rp-input"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </div>
                {errors.email && <span className="rp-error">{errors.email}</span>}
              </div>

              <div className="rp-field">
                <label className="rp-label">Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon"><IconLock /></span>
                  <input
                    className="rp-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange("password")}
                  />
                  <button className="rp-eye" onClick={() => setShowPass((v) => !v)} aria-label="Toggle password">
                    <IconEye open={showPass} />
                  </button>
                </div>
                {errors.password && <span className="rp-error">{errors.password}</span>}
              </div>

              <p className="rp-terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>

              <button className="rp-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
                {!loading && <IconArrow />}
              </button>

              <div className="rp-divider">
                <hr /><span>or continue with</span><hr />
              </div>

              <p className="rp-footer">
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#7c3aed", fontWeight: 500, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
