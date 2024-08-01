import { Box, Image, Text } from "@chakra-ui/react";
import "./Navbar.css";
import { FiSearch } from "react-icons/fi";
import User from "../User/User";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getProfilePicture } from "../../api/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [profileToggle, setProfileToggle] = useState(false);
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
      className="navbar"
      display={"flex"}
      justifyContent={"space-around"}
      alignItems={"center"}
      userSelect={"none"}
      pos={"fixed"}
      width={"100%"}
      top={0}
    >
      {/* logo */}
      <Box>
        <NavLink to={"/"}>
          <Box display={"flex"} alignItems={"center"} gap={4}>
            <Image src="/logo.png" height={"50px"} />
            <Text
              fontSize={"x-large"}
              fontWeight={"bold"}
              letterSpacing={3}
              cursor={"pointer"}
            >
              FriendFusion
            </Text>
          </Box>
        </NavLink>
      </Box>
      {/* search bar */}
      <Box width={"60%"} pos={"relative"}>
        <input
          type="text"
          placeholder="Search for friends"
          className="search__bar"
        />
        <Box pos={"absolute"} top={"11px"} left={2}>
          <FiSearch fontSize={20} />
        </Box>
      </Box>
      {/* profile */}
      <Box cursor={"pointer"} pos={"relative"}>
        <Box onClick={() => setProfileToggle(!profileToggle)}>
          <Image
            src={profilePicture ? profilePicture : "/default_profile.jpg"}
            height={"50px"}
            width={"50px"}
            borderRadius={"50%"}
            objectFit={"cover"}
          />
        </Box>

        <Box pos={"absolute"} top={14} right={2} width={"10vw"}>
          {profileToggle && <User setProfileToggle={setProfileToggle} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
