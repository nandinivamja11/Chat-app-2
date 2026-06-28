import { useState } from "react";
import { useNavigate } from "react-router-dom";

function registerForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if(password !== confirmpassword){
        alert("passwords do not match");
        return;
    }
    console.log({
        username,
        email,
        password,
    });
    navigate("/")
  };
  return(
     <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">
            create account 
        </h2>
        <p className="text-gray-600 text-center mb-6">sign up to start chatting</p>
        <form onClick={handleRegister} className="space-y-4">
            <div>
            <label className="block mb-1 font-medium">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
            type="password" placeholder="Enter your password" value={password}
            onChange={(e) => setpassword(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium">
            Confirm Password
          </label>

          <input
            type="password" placeholder="Confirm your password" value={confirmpassword}
            onChange={(e) => setconfirmpassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* Register Button */}
        <button
          type="submit" 
          onClick={() => navigate("/")}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Register</button>
      </form>

      {/* Login Redirect */}
      <div className="text-center mt-6">
        <span className="text-gray-500">
          Already have an account?
        </span>

        <button
          onClick={() => navigate("/")}
          className="ml-2 text-blue-600 hover:underline">Login</button>
      </div>
    </div>
  );
}

export default registerForm;
