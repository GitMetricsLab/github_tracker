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
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)) {
        errorMessage = "Password must be 8+ characters with letters and numbers";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
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
      const response = await axios.post(`${backendUrl}/api/auth/signup`, formData);
      setMessage(response.data.message);
      if (response.data.message === "User created successfully") {
        navigate("/login");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative h-screen w-screen flex items-center justify-center px-4 overflow-hidden ${mode === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="relative w-full max-w-md px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img src="/crl-icon.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${mode === "dark" ? "text-white" : "text-black"}`}>GitHubTracker</h1>
          <p className={`text-lg font-medium ${mode === "dark" ? "text-slate-300" : "text-gray-700"}`}>Join your GitHub journey</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className={`rounded-3xl p-10 shadow-2xl border ${mode === "dark" ? "bg-white/10 backdrop-blur-xl border-white/20 text-white" : "bg-white border-gray-200 text-black"}`}>
          <h2 className={`text-2xl font-bold text-center mb-8 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 ${mode === "dark" ? "bg-white/10 border-white/20 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-400"}`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 ${mode === "dark" ? "bg-white/10 border-white/20 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-400"}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 ${mode === "dark" ? "bg-white/10 border-white/20 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-400"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 ${mode === "dark" ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className={`w-full font-semibold py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-lg ${mode === "dark" ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"} ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <div className={`text-center mt-6 p-3 rounded-xl ${message.includes("successfully") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
              {message}
            </div>
          )}

          <div className="text-center mt-8">
            <p className={mode === "dark" ? "text-gray-300" : "text-gray-600"}>
              Already have an account?{" "}
              <Link to="/login" className={`font-medium hover:underline transition-colors duration-300 ${mode === "dark" ? "text-white" : "text-black"}`}>
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <div
        className={`${
          mode === "dark" ? "from-slate-900" : "from-slate-100"
        } absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t to-transparent`}
      />
    </div>
  );
};

export default SignUp;
