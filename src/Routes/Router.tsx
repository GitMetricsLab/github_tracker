import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home"; // Import the Home component
import About from "../pages/About/About"; // Import the About component
import Contact from "../pages/Contact/Contact"; // Import the Contact component
import Contributors from "../pages/Contributors/Contributors";
import Signup from "./Signup/Signup.tsx";
import Login from "./Login/Login.tsx";

interface RouterProps {
  theme: string;
}

const Router: React.FC<RouterProps> = ({ theme }) => {


  return (
    <Routes>
      {/* Redirect from root (/) to the home page */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home key={theme} theme={theme} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      
      <Route path="/contributors" element={<Contributors />} />
    </Routes>
  );
};

export default Router;
