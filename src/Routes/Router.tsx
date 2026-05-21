import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loaded pages
const Home = lazy(() => import("../pages/Home/Home.tsx"));
const Tracker = lazy(() => import("../pages/Tracker/Tracker.tsx"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Contributors = lazy(
  () => import("../pages/Contributors/Contributors")
);
const Signup = lazy(() => import("../pages/Signup/Signup.tsx"));
const Login = lazy(() => import("../pages/Login/Login.tsx"));
const ContributorProfile = lazy(
  () => import("../pages/ContributorProfile/ContributorProfile.tsx")
);
const Custom404 = lazy(() => import("../pages/404.tsx"));

const Router = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-lg">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Tracker />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contributors" element={<Contributors />} />
        <Route
          path="/contributor/:username"
          element={<ContributorProfile />}
        />
        <Route path="*" element={<Custom404 />} />
      </Routes>
    </Suspense>
  );
};

export default Router;