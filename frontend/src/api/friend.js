import { instance } from "../axios/axios";

export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    let res = await instance.post("/friendRequest/send", {
      senderId,
      receiverId,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFriendDetail = async (currentUser, checkingUser) => {
  try {
    let res = await instance.get("/friendRequest/getFriendDetail", {
      params: {
        currentUser,
        checkingUser,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
