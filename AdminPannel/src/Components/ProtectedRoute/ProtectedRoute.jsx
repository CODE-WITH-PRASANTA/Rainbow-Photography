
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AUTH_KEY = "isAdminAuthenticated";

const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated =
    sessionStorage.getItem(AUTH_KEY) === "true" ||
    localStorage.getItem(AUTH_KEY) === "true";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
