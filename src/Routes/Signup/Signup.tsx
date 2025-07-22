import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formData // Include cookies for session
      );
      toast.success(response.data.message); // Show success message from backend

      // Navigate to login page after successful signup
      if (response.data.message === "User created successfully") {
        navigate("/login");
      }
    } catch (error: any) {
      if (error.status === 404) {
        toast.error("User not found");
      } else
        toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mt-12 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
          Sign Up
        </button>
      </form>
      {/* {message && <p className="text-center text-red-500 mt-4">{message}</p>} */}
    </div>
  );
};

export default SignUp;
