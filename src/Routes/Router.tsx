import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tracker from "../pages/Tracker/Tracker.tsx";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Contributors from "../pages/Contributors/Contributors";
import Signup from "../pages/Signup/Signup.tsx";
import Login from "../pages/Login/Login.tsx";
import ContributorProfile from "../pages/ContributorProfile/ContributorProfile.tsx";
import Home from "../pages/Home/Home.tsx";
import Profile from "../pages/Profile/Profile.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import EditProfile from "../pages/Editprofile/EditProfile.tsx";

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/track" element={<Tracker />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contributors" element={<Contributors />} />
      <Route path="/contributor/:username" element={<ContributorProfile />} />
      {/*  Protected route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
