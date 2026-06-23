import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Email:", email);
        console.log("Password:", password);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-gray-600 text-center mb-6">Sign in to continue chatting</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="text-right">
                        <button type="button" className="text-blue-400 hover:underline text-sm">Forgot Password?</button>
                    </div>
                        <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Login</button>
                    </form>
                   <div className="text-center mt-6">
                    <span className="text-gray-500">Don't have an account?</span>
                    <button className="ml-2 text-blue-600 hover:underline">
                        Register
                    </button>
                   </div>
                </div>
            </div>
        );
}
export default Login;