import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Profile() {
   const navigate = useNavigate();
  const [name, setName] = useState("Neha");
  const [email, setEmail] = useState("neha123@gmail.com");
  const [bio, setBio] = useState("Frontend Developer");

  const handleSave = () => {
    console.log({
      name,
      email,
      bio,
    });

    alert("Profile Updated Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/150"
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />

          <h2 className="text-2xl font-bold mt-3">
            My Profile
          </h2>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
         
          <button
            onClick={() => navigate("/chat")}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile