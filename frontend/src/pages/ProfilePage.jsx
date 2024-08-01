import { Box } from "@chakra-ui/react";
import ProfilePhoto from "../components/Profile/ProfilePhoto";

const ProfilePage = () => {
  return (
    <Box height={"200vh"} mt={"110px"} width={"60vw"} ml={"auto"} mr={"auto"}>
      <ProfilePhoto />
    </Box>
  );
};

export default ProfilePage;
