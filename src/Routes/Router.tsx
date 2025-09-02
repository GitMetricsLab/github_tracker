import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tracker from "../pages/Tracker/Tracker.tsx";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Contributors from "../pages/Contributors/Contributors";
import Signup from "../pages/Signup/Signup.tsx";
import Login from "../pages/Login/Login.tsx";
import ContributorProfile from "../pages/ContributorProfile/ContributorProfile.tsx";
import Home from "../pages/Home/Home.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/track", element: <Tracker /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/contributors", element: <Contributors /> },
  { path: "/contributor/:username", element: <ContributorProfile /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
