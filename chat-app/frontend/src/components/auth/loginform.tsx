import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/button";
import Input from "../common/input";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    // API call later

    navigate("/chat");
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-bold text-center mb-2">
        Welcome Back
      </h2>

      <p className="text-gray-600 text-center mb-6">
        Sign in to continue chatting
      </p>

      <form onSubmit={handleLogin}
        className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            className="text-blue-500 hover:underline text-sm">Forgot Password?</button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Login</button>
      </form>

      {/* Register */}
      <div className="text-center mt-6">
        <span className="text-gray-500">
          Don't have an account?
        </span>

        <button
          onClick={() => navigate("/register")}
          className="ml-2 text-blue-600 hover:underline">Register</button>
      </div>
    </div>
  );
}

export default LoginForm;