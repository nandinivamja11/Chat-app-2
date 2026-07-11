import { useEffect, useState } from "react";
import { getUnreadChats } from "../services/chat.service";

export default function useUnread() {

    const [unreadCounts, setUnreadCounts] = useState<{
      [key: number]: number;
    }>({});

    const loadUnread = async () => {
  try {
    const data = await getUnreadChats();

    const counts: { [key: number]: number } = {};

    data.forEach((item: any) => {
      counts[item.sender] = Number(item.count);
    });

    setUnreadCounts(counts);
  } catch (err) {
    console.log(err);
  }
};
useEffect(()=>{

   loadUnread();

},[]);
return{
   unreadCounts,
   loadUnread,
};
}