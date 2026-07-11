function MessageBubble({ text, sender, time, type, fileUrl, fileName }: any) {
  const isMe = sender === "me";
  const filePath = fileUrl
  ? `http://localhost:5000${fileUrl}`
  : "";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-xl max-w-xs ${
        isMe ? "bg-green-500 text-white" : "bg-white"
      }`}>
        {type === "image" ? (
  <img
    src={filePath}
    alt={fileName}
    className="rounded-lg max-w-[250px]"
  />
) : type === "video" ? (
  <video
    controls
    className="rounded-lg max-w-[250px]"
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
  <p>{text}</p>
)}
        <p className="text-xs mt-1 opacity-70 text-right">{time}</p>
      </div>
    </div>
  );
}

export default MessageBubble;