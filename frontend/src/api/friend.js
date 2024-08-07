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
export const acceptFriendRequest = async (acceptedBy, acceptedTo) => {
  try {
    let res = await instance.patch("/friendRequest/acceptFriendRequest", {
      params: {
        acceptedBy,
        acceptedTo,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const declineFriendRequest = async (
  declinedBy,
  declinedTo,
  actionType
) => {
  try {
    let res = await instance.delete(
      `/friendRequest/declineFriendRequest?declinedBy=${declinedBy}&declinedTo=${declinedTo}&actionType=${actionType}`
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};
