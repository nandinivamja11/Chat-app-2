import { Camera, Pencil, UserPlus, UserMinus, LogOut, Trash2 } from "lucide-react";

type Props = {
  group: any;
  onClose: () => void;
};

function GroupInfoModal({ group, onClose }: Props) {
  if (!group) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[430px] max-h-[85vh] shadow-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold">Group Info</h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Group Photo */}
        <div className="overflow-y-auto p-5">
        <div className="flex flex-col items-center py-3 border-b">

          {group.avatar ? (
            <img
              src={`http://localhost:5000${group.avatar}`}
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-white text-5xl">
              👥
            </div>
          )}

          <h2 className="mt-4 text-xl font-bold">
            {group.name}
          </h2>

          <p className="text-gray-500">
            {group.members?.length || 0} Members
          </p>
        </div>

        {/* Members */}
        <div className="px-5 py-4 border-b">

          <h3 className="font-semibold mb-3">
            Members ({group.members?.length || 0})
          </h3>

          <div className="space-y-3 max-h-28 overflow-y-auto">

            {group.members
  ?.filter((member: any) => member.User)
  .map((member: any) => (
    <div
      key={member.id}
      className="flex items-center gap-3"
    >
      {member.User.profileImage ? (
        <img
          src={`http://localhost:5000${member.User.profileImage}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          {member.User.username.charAt(0).toUpperCase()}
        </div>
      )}

      <span>{member.User.username}</span>
    </div>
))}
          </div>
        </div>

        {/* Options */}

        <div className="p-4 space-y-2">

          <button className="flex items-center gap-3 w-full p-2  rounded-lg hover:bg-gray-100">
            <Camera size={20}/>
            Change Group Photo
          </button>

          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
            <Pencil size={20}/>
            Edit Group Name
          </button>

          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
            <UserPlus size={20}/>
            Add Members
          </button>

          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
            <UserMinus size={20}/>
            Remove Members
          </button>

          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50">
            <LogOut size={20}/>
            Exit Group
          </button>

          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50">
            <Trash2 size={20}/>
            Delete Group
          </button>

        </div>
</div>
      </div>
    </div>
  );
}

export default GroupInfoModal;