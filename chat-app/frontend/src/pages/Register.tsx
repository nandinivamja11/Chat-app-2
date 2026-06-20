import { useState } from "react";
import RegisterForm from "../components/auth/registerform";

function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            alert("passwords do not match");
            return;
        }
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-fall max-w-md bg-white shadow-lg rounded-xl p-8">
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
            <label className="block mb-1 front-medium">password</label>
            <input type="password" placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required/>
        </div>
        <div>
            <label className="block mb-1 front-medium">Confirm Password</label>
            <input type="password" placeholder="Confirm your password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                required"/>
            </div>
            <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Register</button>
            </form>
            <div className="text-center mt-6">
                <span className="text-gray-500">Already have an account?</span>
                <button className="ml-2 text-blue-600 hover:underline">
                    Login
                </button>
            </div>
        </div>  
    </div>
    );
}
export default Register;