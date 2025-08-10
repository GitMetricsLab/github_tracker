import React, { useState } from 'react';
import { signInWithGoogle } from '../hooks/firebase';

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleSignIn}
      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {/* Optional: Add a Google icon */}
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
      {isLoading ? "Signing in with Google..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignIn;