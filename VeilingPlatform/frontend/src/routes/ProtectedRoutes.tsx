import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  element: React.ReactNode;
  allowedRoles: ("Customer" | "Supplier" | "Auctioneer")[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // saved roles after login

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole as any)) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;