import React, { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  getUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in (fixes Google login "nothing happens" issue)
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = {
        admin: "/a",
        instructor: "/i",
        student: "/s",
        user: "/u",
      };
      navigate(redirectMap[user.role] || "/u", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Google OAuth Login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      // Token is now in Redux → user will be fetched automatically via interceptor or handleExternalToken
      // Just wait for user to appear in state (already handled by useEffect above)

      // Optional: Show toast after a tiny delay to ensure user is loaded
      setTimeout(() => {
        if (user?.name) {
          toast.success(`Welcome back, ${user.name}!`);
        }
      }, 100);
    } else {
      toast.error(resultAction.payload);
    }
  };
  return (
    <section className="flex flex-col gap-y-2">
      <div className="">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 border border-gray-300 bg-white w-full rounded-md h-10 cursor-pointer"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
        <div className="flex items-center my-2">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="w-full border-gray-300" />
        </div>
        <h1 className="font-bold text-center text-2xl m-2 p-2">
          Login to your <br />
          <span className="text-purple-500">Skillify</span> Account
        </h1>
      </div>
      <form action="" onSubmit={handleSubmit}>
        {/* email*/}
        <div>
          <label htmlFor="email" className="text-xl font-serif">
            Email<span className="text-red-700">*</span>
          </label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2 focus:outline-purple-700"
          />
        </div>
        {/*password */}
        <div className="my-3">
          <label htmlFor="password" className="text-xl font-serif">
            Password<span className="text-red-700">*</span>
          </label>
          <br />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2 focus:outline-purple-700"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-800 text-white w-full rounded-md h-10 cursor-pointer font-sans"
        >
          Login
        </button>
      </form>
      <p className="text-center font-sans my-2 p-1">
        New User?
        <Link to="/register" className="text-purple-700 ">
          Register
        </Link>
      </p>
    </section>
  );
};

export default Login;
