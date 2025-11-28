import React, { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      // 🟢 FIXED: Ensure '/auth/register' path is used
      const res = await api.post("/auth/register", { name, email, password });

      if (res.data.status === "success") {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      // Display specific backend error message
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }; // Initiates the redirect to your backend's Google OAuth route

  const handleGoogleLogin = () => {
    // This MUST match the Google OAuth entry point on your backend
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  return (
    <section className="flex flex-col gap-y-4">
      <div>
        <h1 className="font-bold text-center text-2xl m-2 p-1">
          Register your <br /> <span className="text-purple-500">Skillify</span>
          Account
        </h1>
      </div>
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
      {/* Email Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-xl font-serif">
            Name<span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2 focus:outline-purple-700"
            required // 🟢 ADDED required attribute
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="text-xl font-serif">
            Email<span className="text-red-700">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2 focus:outline-purple-700"
            required // 🟢 ADDED required attribute
          />
        </div>
        {/* Password */}
        <div className="my-3">
          <label htmlFor="password" className="text-xl font-serif">
            Password<span className="text-red-700">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-purple-400 my-1 w-full rounded-md p-2 focus:outline-purple-700"
            required // 🟢 ADDED required attribute
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-800 text-white w-full rounded-md h-10 cursor-pointer font-sans"
        >
          Register
        </button>
        {/* Login Link */}
        <p className="text-center font-sans my-2 p-1">
          Already have an account?
          <Link to="/login" className="text-purple-700">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
