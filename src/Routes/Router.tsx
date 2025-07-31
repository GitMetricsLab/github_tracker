
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "../pages/Home/Home"
import About from "../pages/About/About"
import Contact from "../pages/Contact/Contact"
import Contributors from "../pages/Contributors/Contributors"
import Signup from "../pages/Signup/Signup.tsx"
import Login from "../pages/Login/Login.tsx"
import UserProfile from "../pages/UserProfile/UserProfile.tsx"
import UserAnalytics from "../pages/UserAnalytics/UserAnalytics.tsx";



const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/analytics" element={<UserAnalytics />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contributors" element={<Contributors />} />
      <Route path="/contributor/:username" element={<ContributorProfile />} />
    </Routes>
  );
};

export default Router;
