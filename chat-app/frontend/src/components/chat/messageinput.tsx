import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

interface MessageInputProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
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
  const emojiRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // 👇 Outside click -> Close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="bg-white border-t flex items-center gap-3 p-4">
      <div className="relative" ref={emojiRef}>
        <button
          type="button"
          className="text-2xl hover:scale-110 transition"
          onClick={() =>
            setShowEmojiPicker(!showEmojiPicker)
          } >
          😊
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              emojiVersion="13.1"
              width={420}
              height={400}
            />
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
style={{
  fontFamily:
    '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Segoe UI",sans-serif',
}}/>

      <button
        type="button"
        onClick={handleAttachmentClick}>
        📎
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

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