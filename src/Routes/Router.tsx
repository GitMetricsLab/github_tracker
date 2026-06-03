import { Routes, Route } from "react-router-dom";
import Tracker from "../pages/Tracker/Tracker.tsx";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Contributors from "../pages/Contributors/Contributors";
import Signup from "../pages/Signup/Signup.tsx";
import Login from "../pages/Login/Login.tsx";
import ContributorProfile from "../pages/ContributorProfile/ContributorProfile.tsx";
import Home from "../pages/Home/Home.tsx";
import Activity from "../pages/Activity.tsx";
import PrivacyPolicy from "../pages/Privacy/PrivacyPolicy.tsx"; // ✅ Updated import path to match your new folder structure
import ProtectedRoute from "../components/ProtectedRoute.tsx";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contributors" element={<Contributors />} />
      <Route path="/contributor/:username" element={<ContributorProfile />} />

      {/* Privacy Policy page route */}
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Protected Routes - Require Authentication */}
      <Route path="/track" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
    </Routes>
  );
};

export default Router;