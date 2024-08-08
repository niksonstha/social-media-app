/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, Image, Text } from "@chakra-ui/react";
import "./FriendNotification.css";
import { acceptFriendRequest, declineFriendRequest } from "../../api/friend";

const FriendNotification = ({
  friendRequests,
  profileId,
  fetchRequestedFriend,
}) => {
  const handleAccept = async (id) => {
    await acceptFriendRequest(profileId, id);
    fetchRequestedFriend();
  };

  const handleDecline = async (id) => {
    await declineFriendRequest(profileId, id, "decline");
    fetchRequestedFriend();
  };

  return (
    <Box
      className="FriendNotification"
      height={"max-content"}
      display={"flex"}
      flexDir={"column"}
      gap={4}
    >
      {friendRequests.map((friend, index) => (
        <Box
          key={index}
          display={"flex"}
          alignItems={"center"}
          gap={3}
          bgColor={"rgba(255, 255, 255, 0.7)"}
          padding={3}
          rounded={4}
        >
          <Image
            src={friend.senderId.profilePicture}
            height={"60px"}
            width={"60px"}
            rounded={"50%"}
          />
          <Box display={"flex"} flexDir={"column"} gap={3}>
            <Text fontWeight={"bold"}>{friend.senderId.fullname}</Text>
            <Box display={"flex"} gap={2}>
              <Button
                colorScheme="blue"
                onClick={() => handleAccept(friend.senderId._id)}
              >
                accept
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDecline(friend.senderId._id)}
              >
                decline
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FriendNotification;
