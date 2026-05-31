import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

const AUTH_STORAGE_KEY = "github_tracker_auth_user";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = (() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
      return false;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as { username?: string; email?: string };
      return Boolean(parsedUser?.username && parsedUser?.email);
    } catch {
      return false;
    }
  })();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;