import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if the user is authenticated from the Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If authenticated, render the child route. Otherwise, redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
