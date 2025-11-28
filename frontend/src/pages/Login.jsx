import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  getUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../slice/authSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      await dispatch(getUser());
      toast.success("Welcome back!");

      const role = user?.role;

      switch (role) {
        case "admin":
          navigate("/a");
          break;
        case "instructor":
          navigate("/i");
          break;
        case "student":
          navigate("/s");
          break;
        default:
          navigate("/");
      }
    } else {
      toast.error(resultAction.payload || "Login failed");
    }
  };

  return (
    <section className="flex flex-col gap-y-2">
      <div>
        <h1 className="font-bold text-center text-2xl m-2 p-2">
          Login to your <br />
          <span className="text-purple-500">Skillify</span> Account
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2"
          />
        </div>

        <div className="my-3">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-800 text-white w-full rounded-md h-10"
        >
          Login
        </button>
      </form>

      <p className="text-center">
        New User?{" "}
        <Link to="/register" className="text-purple-700">
          Register
        </Link>
      </p>
    </section>
  );
};

export default Login;
