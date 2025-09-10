import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React, { useEffect } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = React.useState(null); // store logged-in user
 useEffect(() => {
    axios.get("http://localhost:5000/api/auth/current", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(err => setUser(null));
  }, []);
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
