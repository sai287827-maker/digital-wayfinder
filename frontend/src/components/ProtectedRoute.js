//This component wraps routes that should only be accessible to authenticated users, redirecting them to the login page if not logged in.

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading authentication status...</div>;
  }

  // If the user is not authenticated, redirect to the login page,
  // but save the current location so they can be redirected back after login.
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

export default ProtectedRoute;
