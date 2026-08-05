import { useEffect, useRef } from "react";
import socket from "../socket";

type Props = {
  userId: number;
  selectedChat: string | null;
  loadUnread: () => void;
  onReceive: (data: any) => void;
  onMessageEdited: (data: any) => void;
  onMessageDeleted?: (data: any) => void;
  onReactionUpdated:(data:any)=>void;
};

export default function useSocket({
  userId,
  selectedChat,
  loadUnread,
  onReceive,
  onMessageEdited,
  onMessageDeleted,
  onReactionUpdated,
}: Props) {
  const onReceiveRef = useRef(onReceive);
  const onMessageEditedRef = useRef(onMessageEdited);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onReactionUpdatedRef = useRef(onReactionUpdated);
  const loadUnreadRef = useRef(loadUnread);

  useEffect(() => {
    onReceiveRef.current = onReceive;
  }, [onReceive]);

  useEffect(() => {
    onMessageEditedRef.current = onMessageEdited;
  }, [onMessageEdited]);

  useEffect(() => {
    onMessageDeletedRef.current = onMessageDeleted;
  }, [onMessageDeleted]);

  useEffect(() => {
    onReactionUpdatedRef.current = onReactionUpdated;
  }, [onReactionUpdated]);

  useEffect(() => {
    loadUnreadRef.current = loadUnread;
  }, [loadUnread]);

  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      console.log("Socket connected", socket.id);
      socket.emit("join", userId);
    };

    const handleError = (error: any) => {
      console.log(error);
    };

    const handleGroupUnread = () => {
      console.log("GROUP UNREAD EVENT");
      loadUnreadRef.current();
    };

    socket.connect();
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);
    socket.on("receive_message", (data: any) => onReceiveRef.current(data));
    socket.on("receive_group_message", (data: any) => onReceiveRef.current(data));
    socket.on("message_edited", (data: any) => onMessageEditedRef.current(data));
    if (onMessageDeleted) socket.on("message_deleted", (data: any) => onMessageDeletedRef.current?.(data));
    socket.on("reaction_updated", (data: any) => onReactionUpdatedRef.current(data));

    socket.on("unread_updated", () => loadUnreadRef.current());
    socket.on("group_unread_updated", handleGroupUnread);
    socket.on("messages_seen", () => loadUnreadRef.current());

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
      socket.off("receive_message");
      socket.off("receive_group_message");
      socket.off("message_edited");
      if (onMessageDeleted) socket.off("message_deleted");
      socket.off("reaction_updated");
      socket.off("unread_updated");
      socket.off("group_unread_updated", handleGroupUnread);
      socket.off("messages_seen");

      socket.disconnect();
    };
  }, [userId]);
}
