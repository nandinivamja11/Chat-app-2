export type Message = {
  id?: number;
  sender: number;
  receiver?: number;
  text: string | null;
  type?: string;
  fileUrl?: string;
  fileName?: string;
  replyTo?: {
  id: number;
  text: string;
  senderName: string;
} | null;
  senderName?: string;
  forwarded?: boolean;
  edited?: boolean;
  time: string;
};

export type Chat = {
  id: number | string;
  groupId?: number;
  name: string;
  messages: Message[];
  unreadCount?: number;
  lastMessage?: string;
  avatar?: string;
  profileImage?: string;
  isOnline?: boolean;
  isGroup?: boolean;
  lastMessageTime?: string;
};

export type ChatResponse = {
  success: boolean;
  data: Chat[];
};