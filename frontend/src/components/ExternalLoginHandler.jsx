import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleExternalToken,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../slice/authSlice";
import toast from "react-hot-toast";

const ExternalLoginHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  //  Handle the token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    // Remove the token from URL bar for security
    urlParams.delete("access_token");
    window.history.replaceState({}, document.title, window.location.pathname);

    // Dispatch token sync + fetch user profile
    dispatch(handleExternalToken(accessToken))
      .unwrap()
      .catch(() => {
        toast.error("Authentication failed!");
        navigate("/login", { replace: true });
      });
  }, [dispatch, navigate]);

  //  Redirect once role and auth state are ready
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome back ${user.name}!`);

      switch (user.role) {
        case "admin":
          navigate("/a", { replace: true });
          break;
        case "instructor":
          navigate("/i", { replace: true });
          break;
        case "student":
          navigate("/s", { replace: true });
          break;
        default:
          navigate("/u", { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold text-purple-600">
        Authenticating... Please Wait.
      </p>
    </div>
  );
};

export default ExternalLoginHandler;
