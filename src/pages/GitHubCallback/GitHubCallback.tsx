import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";
import { FaGithub, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const GitHubCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('GitHub authentication was cancelled or failed.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from GitHub.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Exchange the authorization code for an access token
        const response = await fetch(`${backendUrl}/api/auth/github/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Successfully authenticated with GitHub!');
          setTimeout(() => navigate('/home'), 2000);
        } else {
          throw new Error(data.message || 'Authentication failed');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to authenticate with GitHub');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGitHubCallback();
  }, [searchParams, navigate]);

  return (
    <div
      className={`min-h-screen h-full w-full flex items-center justify-center relative overflow-hidden ${
        mode === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute -top-40 -right-40 w-96 h-96 ${mode === "dark" ? "bg-purple-500" : "bg-purple-300"} rounded-full blur-3xl opacity-30 animate-pulse`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${mode === "dark" ? "bg-blue-500" : "bg-blue-300"} rounded-full blur-3xl opacity-30 animate-pulse`} />
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className={`rounded-3xl p-10 shadow-2xl border text-center ${
          mode === "dark" 
            ? "bg-white/10 backdrop-blur-xl border-white/20 text-white" 
            : "bg-white border-gray-200 text-black"
        }`}>
          
          {/* GitHub Icon */}
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              status === 'loading' 
                ? 'bg-blue-500 animate-pulse' 
                : status === 'success' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
            }`}>
              {status === 'loading' ? (
                <FaGithub className="w-8 h-8 text-white animate-bounce" />
              ) : status === 'success' ? (
                <FaCheckCircle className="w-8 h-8 text-white" />
              ) : (
                <FaExclamationCircle className="w-8 h-8 text-white" />
              )}
            </div>
          </div>

          {/* Status Message */}
          <h2 className={`text-2xl font-bold mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-800"
          }`}>
            {status === 'loading' && 'Connecting to GitHub...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>

          <p className={`text-lg mb-6 ${
            mode === "dark" ? "text-slate-300" : "text-gray-600"
          }`}>
            {message}
          </p>

          {/* Loading Animation */}
          {status === 'loading' && (
            <div className="flex justify-center mb-6">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Redirect Message */}
          <p className={`text-sm ${
            mode === "dark" ? "text-slate-400" : "text-gray-500"
          }`}>
            {status === 'loading' && 'Please wait while we complete the authentication...'}
            {status === 'success' && 'Redirecting you to the dashboard...'}
            {status === 'error' && 'Redirecting you back to login...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback; 