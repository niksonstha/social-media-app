import { Box } from "@chakra-ui/react";
import ProfilePhoto from "../components/Profile/ProfilePhoto";
import AddPost from "../components/AddPost/AddPost";
import UserPost from "../components/UserPost/UserPost";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const userId = useLocation();
  let checkCurrentUser = false;

  if (userId.pathname.split("/")[2] == profile_info._id) {
    checkCurrentUser = true;
  }
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
        {checkCurrentUser && <AddPost />}
      </Box>

      <Box mr={"auto"} ml={"auto"} mt={5} width={"70%"}>
        <UserPost />
      </Box>
    </Box>
  );
};

export default ProfilePage;
