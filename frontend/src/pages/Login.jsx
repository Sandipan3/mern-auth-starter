import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch the login action and unwrap the result
      await dispatch(loginUser({ email, password })).unwrap();
      // Navigate to home page on successful login
      navigate("/");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm">
      <h1 className="text-xl font-bold mb-1">
        Sign in to your <br />
        Skillify account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-purple-600">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
            className="w-full border border-gray-300 rounded px-3 pt-3 pb-2 text-sm focus:outline-none"
          />
        </div>

        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-purple-600">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full border border-gray-300 rounded px-3 pt-3 pb-2 text-sm focus:outline-none"
          />
        </div>

        {/* Display login error if it exists */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="py-2 w-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full block text-center bg-purple-600 text-white py-2 rounded text-sm font-medium disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
