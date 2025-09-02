import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import ThemeWrapper from "./context/ThemeContext";

const Home = lazy(() => import("./pages/Home/Home.tsx"));
const Tracker = lazy(() => import("./pages/Tracker/Tracker.tsx"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Contributors = lazy(() => import("./pages/Contributors/Contributors"));
const Signup = lazy(() => import("./pages/Signup/Signup.tsx"));
const Login = lazy(() => import("./pages/Login/Login.tsx"));
const ContributorProfile = lazy(() => import("./pages/ContributorProfile/ContributorProfile.tsx"));

function RootLayout() {
  return (
    <ThemeWrapper>
      <div className="relative flex flex-col min-h-screen">
        <ScrollProgressBar />
        <Navbar />
        <main className="flex-grow bg-gray-50 dark:bg-gray-800 flex justify-center items-center">
          <Suspense fallback={<div className="p-6">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName="mt-12"
          toastOptions={{
            className: "bg-white dark:bg-gray-800 text-black dark:text-white",
            duration: 5000,
            success: { duration: 3000, iconTheme: { primary: "green", secondary: "white" } },
          }}
        />
      </div>
    </ThemeWrapper>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div className="p-6">Something went wrong loading this page.</div>,
    children: [
      { index: true, element: <Home /> },
      { path: "track", element: <Tracker /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "contributors", element: <Contributors /> },
      { path: "contributor/:username", element: <ContributorProfile /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <RouterProvider
      router={router}
    />
  );
}
