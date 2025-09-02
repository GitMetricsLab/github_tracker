import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import ThemeWrapper from "./context/ThemeContext";

import Tracker from "./pages/Tracker/Tracker.tsx";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Contributors from "./pages/Contributors/Contributors";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import ContributorProfile from "./pages/ContributorProfile/ContributorProfile.tsx";
import Home from "./pages/Home/Home.tsx";

function RootLayout() {
  return (
    <ThemeWrapper>
      <div className="relative flex flex-col min-h-screen">
        <ScrollProgressBar />
        <Navbar />
        <main className="flex-grow bg-gray-50 dark:bg-gray-800 flex justify-center items-center">
          <Outlet />
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
      future={{ v7_startTransition: true } as any}
    />
  );
}
