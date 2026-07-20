import api from "../services/api";
import { useEffect } from "react";
import { getUsers,} from "../services/chat.service";
import { getMyGroups } from "../services/group.service";

export default function useUsers({ userId, selectedChat, setSelectedChat, setChats,
}: any) {
    const fetchChatUsers = async () => {
  try {
    const users = (await getUsers()).filter(
      (u: any) => u.id !== userId
    );

    const chats = await Promise.all(

      users.map(async (user: any) => {
        try {
          const res = await api.get(`/message/conversation/${user.id}`);

          const messages = res.data;

        const last = messages[messages.length - 1];

        const lastMessage =
            messages.length > 0
            ? last.message || `📎 ${last.fileName}`
            : "";

          return {
            id: user.id,
            name: user.username,
            messages: [],
            lastMessage,
          };
        } catch {
          return {
            id: user.id,
            name: user.username,
            messages: [],
            lastMessage: "",
          };
        }
      })
    );
    setChats((prev: any) => {
  const groupChats = prev.filter((chat: any) => chat.isGroup);
  return [...groupChats, ...chats];
});

    //   setChats((prev: any) => {
    //   const groupChats = prev.filter((chat: any) => chat.isGroup);
    //   const combinedChats = [...groupChats, ...chats];

    //   if (combinedChats.length > 0) {
    //     if (selectedChat === null) {
    //       setSelectedChat(combinedChats[0].id);
    //     } else if (combinedChats.some((chat) => chat.id === selectedChat)) {
    //       setSelectedChat(selectedChat);
    //     }
    //   }

    //   return combinedChats;
    // });
  } catch (err) {
    console.log("Error fetching users:", err);
  }
};
useEffect(() => {

    fetchChatUsers();

}, []);
return {

   fetchChatUsers,

};

}