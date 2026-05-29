import React, { createContext, useContext, useState } from "react";

export interface UserData {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateToken: (token: string) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserData | null>(null);

  const setUser = (u: UserData | null) => setUserState(u);

  const updateToken = (token: string) => {
    setUserState((prev) => (prev ? { ...prev, token } : prev));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
