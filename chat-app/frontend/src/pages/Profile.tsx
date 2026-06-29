// import { useNavigate } from "react-router-dom";
// import { useState, useEffect, ChangeEvent } from "react";
// import { getProfile, updateProfile,} from "../services/profile.service";

// function Profile() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [bio, setBio] = useState("");
//   const [profileImage, setProfileImage] = useState(
//     "https://i.pravatar.cc/150"
//   );

//   useEffect(() => {
//     const user = localStorage.getItem("user");

//     if (user) {
//       const userData = JSON.parse(user);

//       setName(userData.username || "");
//       setEmail(userData.email || "");
//       setBio(userData.bio || "");
//       setProfileImage(
//         userData.profileImage || "https://i.pravatar.cc/150"
//       );
//     }
//   }, []);

//   // Change Profile Photo
//   const handleImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     const reader = new FileReader();

//     reader.onloadend = () => {
//       setProfileImage(reader.result as string);
//     };

//     reader.readAsDataURL(file);
//   };

//   // Save Profile
//   const handleSave = () => {
//     const updatedUser = {
//       username: name,
//       email,
//       bio,
//       profileImage,
//     };

//     localStorage.setItem("user", JSON.stringify(updatedUser));

//     alert("Profile Updated Successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

//         {/* Profile Image */}
//         <div className="flex flex-col items-center">

//           <img
//             src={profileImage}
//             alt="Profile"
//             className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
//           />

//           <label className="mt-4 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
//             Edit 

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </label>

//           <h2 className="text-2xl font-bold mt-4">
//             My Profile
//           </h2>

//         </div>

//         {/* Form */}
//         <div className="mt-6 space-y-4">

//           {/* Name */}
//           <div>
//             <label className="block mb-1 font-medium">
//               Name
//             </label>

//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block mb-1 font-medium">
//               Email
//             </label>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Bio */}
//           <div>
//             <label className="block mb-1 font-medium">
//               Bio
//             </label>

//             <textarea
//               rows={3}
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Save Button */}
//           <button
//             onClick={handleSave}
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
//           >
//             Save Changes
//           </button>

//           {/* Chat Button */}
//           <button
//             onClick={() => navigate("/chat")}
//             className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
//           >
//             Go to Chat
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Profile;

import { useNavigate } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from "react";
import { getProfile, updateProfile, } from "../services/profile.service";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/150"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ==========================
  // Load Profile
  // ==========================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getProfile();

        setName(user.username || "");
        setEmail(user.email || "");
        setBio(user.bio || "");

        if (user.profileImage) {
          setProfileImage(
            `http://localhost:5000${user.profileImage}`
          );
        } else {
          setProfileImage("https://i.pravatar.cc/150");
        }
      } catch (err) {
        console.error("Profile Load Error:", err);
      }
    };

    loadProfile();
  }, []);

  // ==========================
  // Image Change
  // ==========================
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    // Preview image
    setProfileImage(URL.createObjectURL(file));
  };

  // ==========================
  // Save Profile
  // ==========================
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("username", name);
      formData.append("bio", bio);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      await updateProfile(formData);

      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        {/* Profile Image */}
        <div className="flex flex-col items-center">

          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
          />

          <label className="mt-4 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">

            Edit Photo

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

          </label>

          <h2 className="text-2xl font-bold mt-4">
            My Profile
          </h2>

        </div>

        {/* Form */}
        <div className="mt-6 space-y-4">

          {/* Name */}
          <div>

            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
            />

          </div>

          {/* Bio */}
          <div>

            <label className="block mb-1 font-medium">
              Bio
            </label>

            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Save Changes
          </button>

          {/* Chat */}
          <button
            onClick={() => navigate("/chat")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            Go To Chat
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;