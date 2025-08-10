import { signInWithGoogle } from "../hooks/firebase";
import React, { useState } from "react";

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(); // No result returned for redirect flow
      // After redirect, handle user in App.tsx using getRedirectResult
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-gray-100"
    >
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignIn;