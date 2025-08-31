import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { registerUser } from "../store/slices/authSlice"; // You will need to create this thunk

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    company: "",
    role: "user", // Default role
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Assuming you have loading/error state for registration
  // const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   await dispatch(registerUser(formData)).unwrap();
    //   alert("Registration successful! Please login.");
    //   navigate("/login");
    // } catch (err) {
    //   console.error("Failed to register:", err);
    // }
    console.log("Form data submitted:", formData); // Placeholder action
    alert("Registration form submitted! (Frontend only)");
    navigate("/login");
  };

  return (
    <div className="flex flex-col px-3 space-y-4">
      <h1 className="text-lg font-bold mb-1">
        Create your <br /> Skillify account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-purple-600">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="w-full border border-gray-300 rounded px-2 pt-2 pb-1 text-sm focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-purple-600">
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
            className="w-full border border-gray-300 rounded px-2 pt-2 pb-1 text-sm focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-purple-600">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            className="w-full border border-gray-300 rounded px-2 pt-2 pb-1 text-sm focus:outline-none"
          />
        </div>

        {/* Role (assuming agency maps to 'admin' and no maps to 'user') */}
        <div>
          <label className="text-xs font-medium text-purple-600 block mb-1">
            Are you an Agency? <span className="text-red-600">*</span>
          </label>
          <div className="flex space-x-3 text-sm">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
                className="accent-purple-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={handleChange}
                className="accent-purple-600"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="py-2 w-full">
          <button
            type="submit"
            // disabled={loading}
            className="block text-center w-full bg-purple-600 text-white my-2 p-2 rounded text-sm font-medium disabled:bg-gray-400"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
