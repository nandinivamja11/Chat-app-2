import { useState } from "react";
import { MoreVertical } from "lucide-react";

function MessageBubble({ id, text, sender, senderName, time, type, fileUrl, fileName,
  replyTo, edited, onDelete, onReply, onForward, onEdit, }: any) {
  const isMe = sender === "me";
  const [showMenu, setShowMenu] = useState(false);
  const filePath = fileUrl
  ? `http://localhost:5000${fileUrl}`
  : "";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} relative`}>
      <div
  onContextMenu={(e) => {
    e.preventDefault();
    setShowMenu(true);
  }}
  className={`relative px-4 py-2 rounded-xl max-w-xs ${
    isMe ? "bg-green-500 text-white" : "bg-white"
  }`}
>
        {type === "image" ? (
  <img
    src={filePath}
    alt={fileName}
    className="rounded-lg max-w-62.5"
  />
) : type === "video" ? (
  <video
    controls
    className="rounded-lg max-w-62.5"
  >
    <source src={filePath} />
  </video>
) : type === "audio" ? (
  <audio controls>
    <source src={filePath} />
  </audio>
) : type === "file" ? (
  <a
    href={filePath}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 underline"
  >
    📄 {fileName}
  </a>
) : (
  <>
  {!isMe && senderName && (
    <p className="text-xs font-semibold text-blue-600 mb-1">
      {senderName}
    </p>
  )}
  {replyTo && (
  <div className="bg-gray-200 rounded p-2 mb-2 text-xs">
    <p className="font-semibold">{replyTo.senderName}</p>
    <p className="truncate">{replyTo.text}</p>
  </div>
)}
  <p
  className="wrap-break-words whitespace-pre-wrap"
  style={{
    fontFamily:
      '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Segoe UI",sans-serif',
  }}
>
  {text}
{edited && (
<span className="text-[10px] ml-2 opacity-60">
(edited)
</span>
)}
</p>
</>
)}
        <p className="text-xs mt-1 opacity-70 text-right">{time}</p>
        {showMenu && (
  <div className="absolute right-0 top-full mt-2 w-44 text-blue-500 bg-white rounded-lg shadow-lg border z-50">

    <button className="w-full text-left px-4 py-2 hover:bg-gray-100"
         onClick={() => { setShowMenu(false); onReply();}}>
         Reply
    </button>

    <button className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
        onClick={() => { setShowMenu(false); onForward();}}>
        Forward
    </button>
    <button className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => { setShowMenu(false); console.log("EDIT BUTTON"); onEdit(); }}>
        Edit
    </button>
    <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
        onClick={() => { setShowMenu(false); onDelete(); }}>
        Delete
    </button>
  </div>
)}
      </div>
    </div>
  );
}

export default MessageBubble;