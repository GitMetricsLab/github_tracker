import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
