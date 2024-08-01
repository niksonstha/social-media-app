import { Box, Image, Text } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProfileModal from "../ProfileModal/ProfileModal";
import { getProfilePicture } from "../../api/user";
import { useEffect, useState } from "react";

const ProfilePhoto = () => {
  const [profilePicture, setprofilePicture] = useState("");
  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const getProfileImage = async () => {
    let res = await getProfilePicture(profile_info._id);
    setprofilePicture(res.data);
  };

  useEffect(() => {
    getProfileImage();
  }, []);

  return (
    <Box
      bgColor={"#FFEFEF"}
      rounded={5}
      padding={5}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box display={"flex"} alignItems={"center"} gap={3}>
        <Image
          src={profilePicture ? profilePicture : "/default_profile.jpg"}
          height={"150px"}
          width={"150px"}
          rounded={"50%"}
          objectFit={"cover"}
        />
        <Box>
          <Text fontSize={"x-large"} fontWeight={"bold"}>
            {profile_info.fullname}
          </Text>
          <Text>1.2K friends</Text>
        </Box>
      </Box>
      <Box>
        <ProfileModal name={profile_info.fullname} email={profile_info.email} />
      </Box>
    </Box>
  );
};

export default ProfilePhoto;
