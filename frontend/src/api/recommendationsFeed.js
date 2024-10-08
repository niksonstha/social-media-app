import { instance } from "../axios/axios";

export const getRecommendedFeed = async (userId) => {
  try {
    const response = await instance.get(`/recommendation/feed/${userId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getRecommendedFriend = async (userId) => {
  try {
    const response = await instance.get(`/recommendation/friendSuggestion/${userId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
