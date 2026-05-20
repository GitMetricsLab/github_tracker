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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div
      className={`min-h-screen h-full w-full flex items-center justify-center relative overflow-hidden ${
        mode === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100"
      }`}
    >
      <div className="absolute inset-0">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 ${
            mode === "dark" ? "bg-purple-500" : "bg-purple-300"
          } rounded-full blur-3xl opacity-30 animate-pulse`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 ${
            mode === "dark" ? "bg-blue-500" : "bg-blue-300"
          } rounded-full blur-3xl opacity-30 animate-pulse`}
        />
        <div
          className={`absolute top-40 left-40 w-96 h-96 ${
            mode === "dark" ? "bg-pink-500" : "bg-pink-300"
          } rounded-full blur-3xl opacity-30 animate-pulse`}
        />
        <div
          className={`absolute top-1/2 right-1/4 w-64 h-64 ${
            mode === "dark" ? "bg-indigo-500" : "bg-indigo-300"
          } rounded-full blur-2xl opacity-20 animate-pulse delay-1000`}
        />
      </div>

      <div className="relative w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img src="/crl-icon.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1
            className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${
              mode === "dark"
                ? "bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
            }`}
          >
            GitHubTracker
          </h1>
          <p
            className={`${mode === "dark" ? "text-slate-300" : "text-gray-700"} text-lg font-medium`}
          >
            Join your GitHub journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`rounded-3xl p-10 shadow-2xl border ${
            mode === "dark"
              ? "bg-white/10 backdrop-blur-xl border-white/20 text-white"
              : "bg-white border-gray-200 text-black"
          }`}
        >
          <h2
            className={`text-2xl font-bold text-center mb-8 ${
              mode === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User
                  className={`h-5 w-5 ${mode === "dark" ? "text-purple-300" : "text-purple-400"}`}
                />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
                className={`w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all ${
                  mode === "dark"
                    ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail
                  className={`h-5 w-5 ${mode === "dark" ? "text-purple-300" : "text-purple-400"}`}
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className={`w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all ${
                  mode === "dark"
                    ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 ${mode === "dark" ? "text-purple-300" : "text-purple-400"}`}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className={`w-full pl-12 pr-12 py-4 rounded-2xl focus:outline-none transition-all ${
                  mode === "dark"
                    ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                  mode === "dark" ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
                } transition-colors duration-200`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
            <div className="flex flex-col gap-3 mt-4">
              <a
                href={`${backendUrl}/api/auth/google`}
                className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300"
              >
                Continue with Google
              </a>
              <a
                href={`${backendUrl}/api/auth/github`}
                className="w-full text-center bg-zinc-800 hover:bg-zinc-900 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300"
              >
                Continue with GitHub
              </a>
            </div>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${
                message.includes("successfully")
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          <div className="text-center mt-8 pb-8">
            <p className={`${mode === "dark" ? "text-slate-500" : "text-gray-600"} text-sm`}>
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
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