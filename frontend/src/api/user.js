import { instance } from "../axios/axios";

export const registerUser = async (fullname, username, email, password) => {
  try {
    const response = await instance.post("/user/registerUser", {
      fullname,
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await instance.post(
      `/user/loginUser`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (id, name, email, profileImage) => {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append("id", id);
    bodyFormData.append("name", name);
    bodyFormData.append("email", email);
    bodyFormData.append("profileImage", profileImage);

    const response = await instance.post("/user/updateProfile", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getProfileDetail = async (id) => {
  try {
    const response = await instance.get(`/user/getProfileDetail/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
