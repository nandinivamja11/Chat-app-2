import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300">

      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8 text-white">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center">
          Welcome Back 👋
        </h2>

        <p className="text-center text-white/80 mt-2 mb-6">
          Sign in to continue chatting
        </p>

        {/* Form */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/80 p-3 text-sm text-white">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          {/* <div>
            <label className="block mb-1 text-sm font-medium text-white/90">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-black outline-none focus:ring-4 focus:ring-pink-300 transition"
            />
          </div> */}
           <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/90 text-black outline-none focus:ring-4 focus:ring-pink-300 transition"
            required/>
        </div>

          {/* Password */}
          {/* <div>
            <label className="block mb-1 text-sm font-medium text-white/90">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-black outline-none focus:ring-4 focus:ring-pink-300 transition"
            />
          </div> */}
           <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/90 text-black outline-none focus:ring-4 focus:ring-pink-300 transition"
            required/>
        </div>

          {/* Forgot */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-white/80 hover:text-white hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-pink-400 hover:bg-pink-300 active:scale-95 transition font-semibold shadow-lg">
           Login</button>
        </form>

        {/* Register */}
        <div className="text-center mt-6 text-white/80">
          Don’t have an account?
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="ml-2 text-yellow-300 hover:underline font-semibold">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;