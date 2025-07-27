import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home"; // Import the Home component
import About from "../pages/About/About"; // Import the About component
import Contact from "../pages/Contact/Contact"; // Import the Contact component
import Contributors from "../pages/Contributors/Contributors";
import Signup from "../pages/Signup/Signup.tsx";
import Login from "../pages/Login/Login.tsx";
import UserProfile from "../pages/UserProfile/UserProfile.tsx";
import UserAnalytics from "../pages/UserAnalytics/UserAnalytics.tsx";

const Router = () => {
  return (
    <Routes>
      {/* Redirect from root (/) to the home page */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/analytics" element={<UserAnalytics />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/home" element={<Home />} />
      <Route path="/contributors" element={<Contributors />} />
      <Route path="/user/:username" element={<UserProfile />} />
    </Routes>
  );
};

export default Router;
