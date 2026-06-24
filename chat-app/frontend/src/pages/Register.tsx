import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import { registerUser } from "../../src/services/auth.service";

function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            alert("passwords do not match");
            return;
        }
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);
        navigate("/");
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

                <p className="text-gray-600 text-center mb-6">Sign up to start chatting</p>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Username</label>
                        <input type="text" placeholder="Enter your username" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required/>    
        </div>
        <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required/>
        </div>
        <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required/>
        </div>
        <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input type="password" placeholder="Confirm your password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                required"/>
            </div>
              <button
                 type="submit"
                 className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Register</button>
            </form>
            <div className="text-center mt-6">
                <span className="text-gray-500">Already have an account?</span>
                 <button
                 type="button"
                 onClick={() => navigate("/")}
                 className="ml-2 text-blue-600 hover:underline">
                Login</button>
            </div>
        </div>  
    </div>
    );
}
export default Register;