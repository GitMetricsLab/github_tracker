import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import the hook for navigation
import GithubIcon from "@mui/icons-material/GitHub";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`,
        formData,
        
      );
      setMessage(response.data.message); // Show success message from backend

      // Navigate to /home if login is successful
      if (response.data.message === 'Login successful') {
        navigate("/home");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleGithubLogin = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  return (
    <div className="w-[400px] max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
      <button
        onClick={handleGithubLogin}
        className="w-full flex items-center justify-center bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 my-4"
      >
        <GithubIcon className="mr-4"/>Login with GitHub
      </button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
      {message && <p className="text-center text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default Login;

