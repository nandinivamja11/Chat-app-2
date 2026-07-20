import { useEffect } from "react";
import socket from "../socket";

type Props = {
  userId: number;
  selectedChat: number | null;
  loadUnread: () => void;
  onReceive: (data: any) => void;
};

export default function useSocket({
  userId,
  selectedChat,
  loadUnread,
  onReceive,
}: Props) {

  useEffect(() => {
    if (!userId) return;
    const handleConnect = () => {
      console.log("Socket connected", socket.id);
      socket.emit("join", userId);
    };

    const handleError = (error: any) => {
      console.log(error);
    };

    socket.connect();
    socket.on("connect", handleConnect);

    socket.on("connect_error", handleError);

    socket.on("receive_message", onReceive);
    socket.on("receive_group_message", onReceive);

    socket.on("unread_updated", loadUnread);
    socket.on("group_unread_updated", loadUnread);

    socket.on("messages_seen", loadUnread);

    return () => {

      socket.off("connect", handleConnect);

      socket.off("connect_error", handleError);

      socket.off("receive_message", onReceive);
      socket.off("receive_group_message", onReceive);

      socket.off("unread_updated", loadUnread);
      socket.off("group_unread_updated", loadUnread);

      socket.off("messages_seen", loadUnread);

      socket.disconnect();

    };

  }, [userId, selectedChat]);

}
