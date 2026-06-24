function MessageBubble({ text, sender, time }: any) {
  const isMe = sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-sm px-4 py-2 rounded-2xl shadow ${
          isMe
            ? "bg-green-500 text-white rounded-br-md"
            : "bg-white text-black rounded-bl-md"
        }`}
      >
        <p>{text}</p>
        <p className="text-xs mt-1 opacity-70 text-right">{time}</p>
      </div>
    </div>
  );
}

export default MessageBubble;