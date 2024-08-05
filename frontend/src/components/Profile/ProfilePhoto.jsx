/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Image, Text } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProfileModal from "../ProfileModal/ProfileModal";
import { getProfileDetail } from "../../api/user";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ProfilePhoto = () => {
  const [profileDetail, setprofileDetail] = useState(null);
  const userId = useLocation();
  const token = Cookies.get("uid");

  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const getProfileImage = async () => {
    let res = await getProfileDetail(userId.pathname.split("/")[2]);

    setprofileDetail(res.data);
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
          src={
            profileDetail
              ? profileDetail?.profilePicture
              : "/default_profile.jpg"
          }
          height={"150px"}
          width={"150px"}
          rounded={"50%"}
          objectFit={"cover"}
        />
        <Box>
          <Text fontSize={"x-large"} fontWeight={"bold"}>
            {profileDetail?.fullname}
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
