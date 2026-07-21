import { User, KeyRound, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SettingsModal({ onClose }: any) {
    const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[380px] rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold">Settings</h2>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="p-3">

          <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition"
            onClick={() => {onClose();
                 navigate("/profile")}}>
            <User size={20} />
            <span>Edit Profile</span>
          </button>

          <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
            <KeyRound size={20} />
            <span>Change Password</span>
          </button>

          <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-red-50 text-red-600 transition"
          onClick={() => navigate("/")}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>

        </div>

      </div>
    </div>
  );
}

export default SettingsModal;