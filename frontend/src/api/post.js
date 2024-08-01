import { instance } from "../axios/axios";

export const createPost = async (caption, image) => {
  console.log(caption, image);
  var bodyFormData = new FormData();
  bodyFormData.append("caption", caption);
  bodyFormData.append("image", image);

  try {
    let response = await instance.post("/post/createPost", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
