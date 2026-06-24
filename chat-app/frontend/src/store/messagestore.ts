import { create } from "zustand";

type Message = {
  id: string;
  text: string;
  sender: string;
  time: string;
};

type MessageStore = {
  messages: Message[];

  setMessages: (messages: Message[]) => void;

  addMessage: (message: Message) => void;

  deleteMessage: (id: string) => void;

  editMessage: (
    id: string,
    updatedText: string
  ) => void;
};

const useMessageStore =
  create<MessageStore>((set) => ({
    messages: [],

    setMessages: (messages) =>
      set({
        messages,
      }),

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    deleteMessage: (id) =>
      set((state) => ({
        messages: state.messages.filter(
          (message) =>
            message.id !== id
        ),
      })),

    editMessage: (
      id,
      updatedText
    ) =>
      set((state) => ({
        messages: state.messages.map(
          (message) =>
            message.id === id
              ? {
                  ...message,
                  text: updatedText,
                }
              : message
        ),
      })),
  }));

export default useMessageStore;