import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user, setUser }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/dashboard", { withCredentials: true })
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage(err.response.data.message));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setUser(null); // clear user in state
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <p>{message}</p>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
