import { Box } from "@chakra-ui/react";
import ProfilePhoto from "../components/Profile/ProfilePhoto";
import AddPost from "../components/AddPost/AddPost";
import UserPost from "../components/UserPost/UserPost";

const ProfilePage = () => {
  return (
    <Box
      height={"max-content"}
      mt={"110px"}
      width={"50vw"}
      ml={"auto"}
      mr={"auto"}
      mb={"100px"}
    >
      <Box>
        <ProfilePhoto />
        <AddPost />
      </Box>

      <Box mr={"auto"} ml={"auto"} mt={5} width={"70%"}>
        <UserPost />
      </Box>
    </Box>
  );
};

export default ProfilePage;
