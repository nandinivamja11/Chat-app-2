// import api from "./api";

// export const createGroup = async (
//   groupName: string,
//   members: number[]
// ) => {
//   const res = await api.post("/group/create", {
//     groupName,
//     members,
//   });

//   return res.data;
// };

// export const getMyGroups = async () => {
//   const res = await api.get("/group/my-groups");
//   return res.data;
// };
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