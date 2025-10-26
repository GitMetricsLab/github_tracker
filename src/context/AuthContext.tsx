import React, { createContext, useState, useEffect } from "react";
import { Octokit } from "octokit";

type AuthContextType = {
  username: string;
  token: string;
  setUsername: (u: string) => void;
  setToken: (t: string) => void;
  logout: () => void;
  getOctokit: () => any | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsernameState] = useState<string>("");
  const [token, setTokenState] = useState<string>("");

  useEffect(() => {
    // hydrate from localStorage if present
    try {
      const s = localStorage.getItem("gh_username");
      const t = localStorage.getItem("gh_token");
      if (s) setUsernameState(s);
      if (t) setTokenState(t);
    } catch (e) {
      // ignore
    }
  }, []);

  const setUsername = (u: string) => {
    setUsernameState(u);
    try {
      if (u) localStorage.setItem("gh_username", u);
      else localStorage.removeItem("gh_username");
    } catch (e) {}
  };

  const setToken = (t: string) => {
    setTokenState(t);
    try {
      if (t) localStorage.setItem("gh_token", t);
      else localStorage.removeItem("gh_token");
    } catch (e) {}
  };

  const logout = () => {
    setUsernameState("");
    setTokenState("");
    try {
      localStorage.removeItem("gh_username");
      localStorage.removeItem("gh_token");
    } catch (e) {}
  };

  const getOctokit = () => {
    if (!username || !token) return null;
    try {
      return new Octokit({ auth: token });
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ username, token, setUsername, setToken, logout, getOctokit }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
