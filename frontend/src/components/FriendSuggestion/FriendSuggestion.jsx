/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";

import { sendFriendRequest } from "../../api/friend";

const FriendSuggestion = ({
  userId,
  suggestedFriends,
  fetchSuggestedFriend,
}) => {
  const sendRequest = async (profileId) => {
    await sendFriendRequest(userId, profileId);
    fetchSuggestedFriend();
  };

  return (
    <Box>
      {suggestedFriends.length > 0 && (
        <Heading fontSize={["0.8rem", "1rem", "1.3rem", "1.5rem", "1.8rem"]}>
          You may know these people
        </Heading>
      )}
      {suggestedFriends.map((friend, index) => {
        return (
          <Box
            key={index}
            display={"flex"}
            alignItems={"center"}
            mt={5}
            bgColor={"#F0EBE3"}
            padding={2}
            rounded={10}
          >
            <Image
              src={friend.profilePicture}
              height={"50px"}
              width={"50px"}
              rounded={"50%"}
              objectFit={"cover"}
              mr={5}
            />
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={4}
              flexGrow={5}
            >
              <Text fontSize={["0.7rem", "0.8rem", "0.9rem", "0.9rem", "1rem"]}>
                {friend.fullname}
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => sendRequest(friend.userId)}
              >
                Add Friend
              </Button>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default FriendSuggestion;
