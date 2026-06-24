export type Message = {
  id: string;
  chatId: string;

  text: string;

  senderId: string;
  senderName: string;

  createdAt: string;

  status: "sent" | "delivered" | "read";

  isEdited?: boolean;

  replyTo?: string;
};

export type MessageResponse = {
  success: boolean;
  data: Message[];
};