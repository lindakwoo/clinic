import React, { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default ProtectedRoute;