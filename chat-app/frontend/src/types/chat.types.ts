export type Chat = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
};

export type ChatResponse = {
  success: boolean;
  data: Chat[];
};