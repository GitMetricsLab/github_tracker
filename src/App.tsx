import { useEffect } from "react";
import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./hooks/firebase";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import Router from "./Routes/Router";
import ThemeWrapper from "./context/ThemeContext";

function App() {
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // Get user info from Firebase
          const email = result.user.email;
          const name = result.user.displayName;
          const googleId = result.user.uid;

          // Send user info to backend
          await axios.post("/api/auth/google-login", {
            email,
            name,
            googleId,
          });

          // You can now set user state, navigate, etc.
        }
      } catch (error) {
        console.error("Google redirect error:", error);
      }
    };

    handleGoogleRedirect();
  }, []);

  return (
    <ThemeWrapper>
      <div className="relative flex flex-col min-h-screen">
        <ScrollProgressBar />

        <Navbar />

        <main className="flex-grow bg-gray-50 dark:bg-gray-800 flex justify-center items-center">
          <Router />
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
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "white",
              },
            },
          }}
        />
      </div>
    </ThemeWrapper>
  );
}

export default App;
