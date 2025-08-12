import { signInWithGoogle } from "../hooks/firebase";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      console.log("Google userCredential:", userCredential);

      if (userCredential && userCredential.user) {
        const idToken = await userCredential.user.getIdToken();
        const { email, displayName, uid } = userCredential.user;
        console.log("Google user info:", { email, displayName, uid });

        const response = await axios.post(
          `${backendUrl}/api/auth/google-login`,
          {
            email,
            name: displayName,
            googleId: uid,
          }
        );
        console.log("Backend response:", response.data);

        if (response.data.message === "Login successful") {
          navigate("/");
        } else {
          alert(response.data.message || "Google login failed");
        }
      } else {
        alert("No user returned from Google sign-in");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
    >
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignIn;