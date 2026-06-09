import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      } else if (
        !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)
      ) {
        errorMessage =
          "Password must be 8+ characters with letters and numbers";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
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
      : !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(
            formData.password,
          )
        ? "Password must be 8+ characters with letters and numbers"
        : "";

    if (usernameError || emailError || passwordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formData,
      );

      setMessage(response.data.message);

      if (response.data.message === "User created successfully") {
        navigate("/login");
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `
    w-full
    pl-12
    pr-4
    py-4
    rounded-xl
    bg-slate-900
    border
    border-slate-700
    text-white
    placeholder-slate-500
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-cyan-500
    focus:border-cyan-500
    focus:bg-slate-800
  `;

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        mode === "dark" ? "bg-[#020817]" : "bg-slate-50"
      }`}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Blue Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[160px]" />
      </div>

      <div className="relative w-full max-w-md px-6">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
            <img
              src="/crl-icon.png"
              alt="GitHub Tracker"
              className="w-14 h-14 object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">GitHubTracker</h1>

          <p className="text-slate-400 text-lg">
            Build insights from every contribution.
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            rounded-3xl
            p-8
            bg-slate-950/90
            backdrop-blur-md
            border
            border-slate-800
            shadow-[0_0_40px_rgba(0,0,0,0.45)]
          "
        >
          <h2 className="text-3xl font-bold text-white mb-3 text-center">
            Create Your Account
          </h2>

          <p className="text-slate-400 text-sm text-center leading-relaxed mb-8">
            Track GitHub activity, analyze contribution trends, and gain
            actionable insights into repository engagement and developer
            productivity.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>

                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {errors.username && (
                <p className="text-red-400 text-sm mt-2">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-cyan-400
                    focus:text-cyan-400
                    transition-colors
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                py-4
                rounded-xl
                font-semibold
                text-white
                bg-gradient-to-r
                from-cyan-500
                to-blue-500
                hover:from-cyan-400
                hover:to-blue-400
                focus:ring-4
                focus:ring-cyan-500/30
                transition-all
                duration-300
                hover:scale-[1.01]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-5 p-3 rounded-lg text-center ${
                message.includes("successfully")
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message}
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="
                  text-cyan-400
                  hover:text-cyan-300
                  font-semibold
                  underline-offset-4
                  hover:underline
                  transition-colors
                "
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
