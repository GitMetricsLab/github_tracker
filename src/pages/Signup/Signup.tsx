import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formData
      );

      setMessage(response.data.message);

      if (response.data.message === "User created successfully") {
        navigate("/login");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative h-screen w-screen 
      bg-gradient-to-br 
      from-indigo-200 via-purple-200 to-pink-200 
      dark:from-indigo-900 dark:via-purple-800 dark:to-pink-700 
      flex items-center justify-center px-4 overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 
            bg-white dark:bg-gray-200 rounded-3xl mb-6 shadow-2xl 
            transform hover:scale-105 transition duration-300 overflow-hidden">
            <img src="/crl-icon.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            GitHubTracker
          </h1>

          <p className="text-purple-600 dark:text-purple-200 text-lg">
            Join your GitHub journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg 
          rounded-3xl p-8 border border-gray-200 dark:border-white/20 shadow-2xl">

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
            Create Account
          </h2>

          <div className="space-y-6">
            {/* Username */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-500 dark:text-purple-300" />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 
                  bg-white/70 dark:bg-white/10 
                  border border-gray-300 dark:border-white/20 
                  rounded-2xl text-gray-900 dark:text-white 
                  placeholder-gray-500 dark:placeholder-purple-300 
                  focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-500 dark:text-purple-300" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 
                  bg-white/70 dark:bg-white/10 
                  border border-gray-300 dark:border-white/20 
                  rounded-2xl text-gray-900 dark:text-white 
                  placeholder-gray-500 dark:placeholder-purple-300 
                  focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-500 dark:text-purple-300" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 
                  bg-white/70 dark:bg-white/10 
                  border border-gray-300 dark:border-white/20 
                  rounded-2xl text-gray-900 dark:text-white 
                  placeholder-gray-500 dark:placeholder-purple-300 
                  focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                text-white font-semibold py-4 rounded-2xl 
                hover:from-purple-600 hover:to-pink-600 
                transform hover:scale-105 transition shadow-lg"
            >
              Create Account
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-center mt-6 p-3 rounded-xl ${
              message.includes("successfully")
                ? "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-500/20"
                : "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/20"
            }`}>
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-700 dark:text-purple-200">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-white font-medium">
                  Sign in here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
