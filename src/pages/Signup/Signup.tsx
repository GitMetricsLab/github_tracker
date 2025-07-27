import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    password: "" 
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
      const response = await axios.post(`${backendUrl}/api/auth/signup`,
        formData // Include cookies for session
      );
      setMessage(response.data.message); // Show success message from backend

      // Navigate to login page after successful signup
      if (response.data.message === 'User created successfully') {
        navigate("/login");}

    
    // // Simulate API call (replace with your actual backend integration)
    // try {
    //   // Mock successful signup
    //   setMessage("Account created successfully! Redirecting to login...");
      
    //   // In your actual implementation, integrate with your backend here:
    //   // const response = await fetch(`${backendUrl}/api/auth/signup`, {
    //   //   method: 'POST',
    //   //   headers: { 'Content-Type': 'application/json' },
    //   //   body: JSON.stringify(formData)
    //   // });
      
    //   setTimeout(() => {
    //     // Navigate to login page in your actual implementation
    //     console.log("Redirecting to login page...");
    //   }, 2000);
      
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 overflow-hidden">
  <img src="/crl-icon.png" alt="Logo" className="w-14 h-14 object-contain" />
</div>
          <h1 className="text-4xl font-bold text-white mb-2">GitHubTracker</h1>
          <p className="text-purple-200 text-lg">Join your GitHub journey</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">Create Account</h2>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Create Account
            </button>
          </div>

          {message && (
            <div className={`text-center mt-6 p-3 rounded-xl ${
              message.includes('successfully') 
                ? 'text-green-300 bg-green-500/20' 
                : 'text-red-300 bg-red-500/20'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-purple-200">
              Already have an account?{' '}
              <button
                onClick={() => console.log('Navigate to login')}
                className="text-purple-300 hover:text-white font-medium transition-colors duration-300"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;