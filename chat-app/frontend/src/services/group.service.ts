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

export const getGroupUnreadCounts = async () => {
  const res = await api.get("/group/unread");
  return res.data;
};
export const uploadGroupFile = async (
  groupId: number,
  file: File
) => {
  const formData = new FormData();

  formData.append("groupId", groupId.toString());
  formData.append("file", file);

  const res = await api.post("/group/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};