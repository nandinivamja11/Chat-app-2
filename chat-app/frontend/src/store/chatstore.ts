import { create } from "zustand";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
};

type ChatStore = {
  chats: Chat[];
  selectedChat: Chat | null;

  setChats: (chats: Chat[]) => void;
  selectChat: (chat: Chat) => void;
  clearSelectedChat: () => void;
};

const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  selectedChat: null,

  setChats: (chats) =>
    set({
      chats,
    }),

  selectChat: (chat) =>
    set({
      selectedChat: chat,
    }),

  clearSelectedChat: () =>
    set({
      selectedChat: null,
    }),
}));

export default useChatStore;