import { useEffect, useState } from "react";
import { getUnreadChats } from "../services/chat.service";
import { getGroupUnreadCounts } from "../services/group.service";

export default function useUnread() {

    const [unreadCounts, setUnreadCounts] = useState<{
      [key: string]: number;
    }>({});

   const loadUnread = async () => {
  try {
    const privateUnread = await getUnreadChats();
    const groupUnread = await getGroupUnreadCounts();

    const counts: any = {};

privateUnread.forEach((item: any) => {
  counts[`user-${item.sender}`] = Number(item.count);
});

groupUnread.forEach((item: any) => {
  counts[`group-${item.groupId}`] = Number(item.count);
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