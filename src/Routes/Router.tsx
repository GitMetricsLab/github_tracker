import { Routes, Route } from "react-router-dom";
import Tracker from "../pages/Tracker/Tracker.tsx";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Contributors from "../pages/Contributors/Contributors";
import Signup from "../pages/Signup/Signup.tsx";
import Login from "../pages/Login/Login.tsx";
import ContributorProfile from "../pages/ContributorProfile/ContributorProfile.tsx";
import Home from "../pages/Home/Home.tsx";
import ProfilePage from "../pages/Profile/ProfilePage.tsx";
import EditProfilePage from "../pages/Profile/EditProfilePage.tsx";
import Activity from "../pages/Activity.tsx";
import PrivacyPolicy from "../pages/Privacy/PrivacyPolicy.tsx"; // ✅ Updated import path to match your new folder structure

const Router = () => {
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
      <Route path="/me" element={<ProfilePage />}></Route>
      <Route path="/profile/edit" element={<EditProfilePage />}></Route>
      <Route path="/activity" element={<Activity />} />

      {/* Privacy Policy page route */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default Router;