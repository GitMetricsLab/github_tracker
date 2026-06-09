import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const themeContext = useContext(ThemeContext) as ThemeContextType;

  const { mode } = themeContext;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        formData,
      );

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

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${
        mode === "dark" ? "bg-[#020817]" : "bg-slate-100"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Blue Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,180,255,0.12),transparent_35%)]" />

        {/* Cyan Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.08),transparent_30%)]" />

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md px-4 sm:px-6 -mt-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl overflow-hidden">
            <img
              src="/crl-icon.png"
              alt="Logo"
              className="w-14 h-14 object-contain"
            />
          </div>

          <h1
            className={`text-4xl font-extrabold bg-clip-text text-transparent mb-4 ${
              mode === "dark"
                ? "bg-gradient-to-r from-blue-400 via-cyan-300 to-cyan-400"
                : "bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-500"
            }`}
          >
            GitHubTracker
          </h1>

          <p
            className={`max-w-sm mx-auto leading-relaxed text-base ${
              mode === "dark" ? "text-slate-300" : "text-gray-700"
            }`}
          >
            Track repositories, commits, contributions and developer activity
            with powerful GitHub insights.
          </p>
        </div>

        {/* Login Card */}
        <div
          className={`rounded-3xl p-8 sm:p-10 ${
            mode === "dark"
              ? "bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 text-white shadow-[0_0_40px_rgba(0,180,255,0.08)]"
              : "bg-white border border-gray-200 text-black shadow-xl"
          }`}
        >
          <h2
            className={`text-2xl font-bold text-center mb-2 ${
              mode === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Welcome Back
          </h2>

          <p
            className={`text-center mb-8 text-sm ${
              mode === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Sign in to access your GitHub analytics dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                autoComplete="username"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-4 rounded-2xl transition-all duration-200 focus:outline-none ${
                  mode === "dark"
                    ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-4 rounded-2xl transition-all duration-200 focus:outline-none ${
                  mode === "dark"
                    ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
                }`}
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                bg-gradient-to-r
                from-blue-600
                via-cyan-500
                to-cyan-400
                text-white
                py-4
                px-6
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]
                focus:ring-4
                focus:ring-cyan-500/30
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${
                message === "Login successful"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-slate-800">
            <p
              className={`text-sm ${
                mode === "dark" ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Don't have an account?
              <Link
                to="/signup"
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div
        className={`absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t ${
          mode === "dark" ? "from-[#020817]" : "from-slate-100"
        } to-transparent`}
      />
    </div>
  );
};

export default Login;
