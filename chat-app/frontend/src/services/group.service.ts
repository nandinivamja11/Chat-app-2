import api from "./api";

export const createGroup = async (
  name: string,
  members: number[],
  groupImage?: File
) => {
  console.log("Sending Group Data:", {
    name,
    members,
    groupImage
  });

  const formData = new FormData();

  formData.append("name", name);

  members.forEach((id) => {
    formData.append("members", id.toString());
  });

  if (groupImage) {
    formData.append("groupImage", groupImage);
  }

  const res = await api.post("/group/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
export const updateGroupName = async (
  groupId: number,
  name: string
) => {
  const res = await api.put(`/group/name/${groupId}`, {
    name,
  });

  return res.data;
};
export const updateGroupPhoto = async (
  groupId: number,
  file: File
) => {
  const formData = new FormData();
  formData.append("groupImage", file);

  const res = await api.put(
    `/group/photo/${groupId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
export const deleteGroupMessage = async (
  id: number,
  type: "me" | "everyone"
) => {
  return api.delete(`/group/message/delete/${id}`, {
    data: { type },
  });
};