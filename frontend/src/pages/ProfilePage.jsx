import { Box } from "@chakra-ui/react";
import ProfilePhoto from "../components/Profile/ProfilePhoto";
import AddPost from "../components/AddPost/AddPost";

const ProfilePage = () => {
  return (
    <Box
      height={"max-content"}
      mt={"110px"}
      width={"60vw"}
      ml={"auto"}
      mr={"auto"}
      mb={"100px"}
    >
      <ProfilePhoto />
      <AddPost />
    </Box>
  );
};

export default ProfilePage;
