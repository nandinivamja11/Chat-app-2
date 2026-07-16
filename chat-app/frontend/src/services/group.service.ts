import api from "./api";

export const createGroup = async (
  name: string,
  members: number[]
) => {
  console.log("Sending Group Data:", {
    name,
    members,
  });

  const res = await api.post("/group/create", {
    name,
    members,
  });

  return res.data;
};

export const getMyGroups = async () => {
  const res = await api.get("/group/my-groups");
  return res.data;
};

export const getGroupMessages = async (groupId: number) => {
  const res = await api.get(`/group/messages/${groupId}`);
  return res.data;
};