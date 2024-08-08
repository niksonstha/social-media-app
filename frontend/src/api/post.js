import { instance } from "../axios/axios";

export const createPost = async (caption, image, id) => {
  var bodyFormData = new FormData();
  bodyFormData.append("caption", caption);
  bodyFormData.append("image", image);
  bodyFormData.append("id", id);

  try {
    let response = await instance.post("/post/createPost", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (id) => {
  try {
    let response = await instance.get(`/post/getPost/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id) => {
  try {
    let response = await instance.delete(`/post/deletePost/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const likePost = async (userId, postId) => {
  try {
    let response = await instance.post(`/postLike/likeOnPost`, {
      userId,
      postId,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getPostLike = async () => {
  try {
    let response = await instance.get(`/postLike/getPostLike`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
