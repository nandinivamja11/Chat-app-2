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
      navigate("/chat");
    } catch (err) {
      console.error(err);
      alert("Unable to update profile");
    }
  };
  const [notifications, setNotifications] =
useState(true);

const [darkMode, setDarkMode] =
useState(false);

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
          <div className="border-t pt-6 mt-6">

  <h3 className="text-lg font-semibold mb-4">
    Account
  </h3>

{/* change password */}
  <button
    onClick={() => navigate("/change-password")}
    className="w-full flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    <span>🔒 Change Password</span>
    <span>›</span>
  </button>

</div>

{/* notifications */}
<div className="mt-4 flex justify-between border rounded-lg px-4 py-3">
  <span>🔔 Notifications</span>

  <input
    type="checkbox"
    checked={notifications}
    onChange={() =>
      setNotifications(!notifications)
    }
  />

</div>

{/* dark mode */}
<div className="mt-4 flex justify-between border rounded-lg px-4 py-3">

  <span>🌙 Dark Mode</span>

  <input
    type="checkbox"
    checked={darkMode}
    onChange={() =>
      setDarkMode(!darkMode)
    }
  />
</div>

{/* logout */}
<button
  onClick={() => {
    localStorage.clear();
    navigate("/");
  }}
  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
>Logout</button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          > Save Changes
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