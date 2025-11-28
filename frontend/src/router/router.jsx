import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import DummyPage from "../components/DummyPage";
import React from "react";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public Routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/unauthorized",
        element: <div className="p-4"> Unauthorized Access</div>,
      },

      // Protected Routes (any logged-in user)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <div>Welcome to your Dashboard!</div> },
          { path: "/dummy", element: <DummyPage /> },
        ],
      },

      //  Admin Only Routes
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/a", element: <div>Admin Dashboard</div> },
          { path: "/a/users", element: <div>Manage Users</div> },
        ],
      },

      //  Instructor Only Routes
      {
        element: <ProtectedRoute allowedRoles={["instructor"]} />,
        children: [{ path: "/i", element: <div>Instructor Panel </div> }],
      },

      //  Student Only Routes
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [{ path: "/s", element: <div>Student Home </div> }],
      },
    ],
  },
  {
    path: "*",
    element: <div className="text-center">404 invalid route!</div>,
  },
]);

export default router;
