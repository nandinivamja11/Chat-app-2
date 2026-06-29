// import  axios from "axios";
// const API_URL = "http://localhost:5000/api/profile";

// //get profile
// export const getProfile = async () => {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(API_URL, {
//         headers: {
//             Authorization: token,
//         },
//     });
//     return response.data;
// };

// //update profile
// export const updateProfile = async (profileData: {
//     username: string;
//     bio: string;
//     profileImage: string;
// }) => {
//     const token = localStorage.getItem("token");
//     const respose = await axios.put(API_URL, profileData, {
//         headers: {
//             Authorization: token,
//         },
//     });
//     return respose.data;
// };

import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";

// Get Profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// Update Profile
export const updateProfile = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(API_URL, formData, {
    headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};