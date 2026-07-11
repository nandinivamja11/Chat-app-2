export type Message = {
  id?: number;
  sender: number;
  receiver: number;

  text: string | null;

  type?: string;
  fileUrl?: string;
  fileName?: string;

  time: string;
};

export type Chat = {
  id: number;
  name: string;

  messages: Message[];

  unreadCount?: number;

  lastMessage?: string;

  avatar?: string;

  isOnline?: boolean;

  lastMessageTime?: string;
};

export type ChatResponse = {
  success: boolean;
  data: Chat[];
};