import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Public Routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      // Protected Routes
      {
        element: <ProtectedRoute />, // Wrap protected routes
        children: [
          { path: "/", element: <div>Welcome to your Dashboard!</div> },
          // Add other protected routes here, e.g., /profile, /settings
        ],
      },
    ],
  },
]);

export default router;
