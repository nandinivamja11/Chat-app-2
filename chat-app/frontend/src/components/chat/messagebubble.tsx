function MessageBubble({ text, sender, time }: any) {
  const isMe = sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-xl max-w-xs ${
        isMe ? "bg-green-500 text-white" : "bg-white"
      }`}>
        <p>{text}</p>
        <p className="text-xs mt-1 opacity-70 text-right">{time}</p>
      </div>
    </div>
  );
}

export default MessageBubble;