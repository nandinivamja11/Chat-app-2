import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";

interface MessageInputProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSend: () => void;
    onFileSelect: (file: File) => void;
}

function MessageInput({
  message,
  setMessage,
  handleSend,
  onFileSelect,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
};
const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
) => {

    const file = e.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

}; 

  const onSend = () => {
    if (!message.trim()) return;
    handleSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="bg-white border-t flex items-center gap-3 p-4">

      {/* Emoji button */}
      <button className="text-2xl hover:scale-110 transition">
        😊
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Attachment */}
      <button type="button"
          onClick={handleAttachmentClick}>
           📎
        </button>
        <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }}
    onChange={handleFileChange}
/>

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={!message.trim()}
        className={`px-5 py-2 rounded-lg text-white transition ${
          message.trim()
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-blue-300 cursor-not-allowed"
        }`}
      >
        Send
      </button>

    </div>
  );
}

export default MessageInput;