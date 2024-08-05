/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Image, Text } from "@chakra-ui/react";
import "./Navbar.css";
import { FiSearch } from "react-icons/fi";
import User from "../User/User";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProfileDetail, getUsersSearch } from "../../api/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [profileToggle, setProfileToggle] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const getProfileImage = async () => {
    let res = await getProfileDetail(profile_info._id);
    setProfilePicture(res.data.profilePicture);
  };

  const fetchSearchUser = async () => {
    if (searchUser.trim() === "") {
      setSearchResults([]);
      return;
    }
    let res = await getUsersSearch(searchUser);
    setSearchResults(res.data);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchSearchUser();
    }
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
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          onKeyUp={handleKeyPress}
        />
        <Box pos={"absolute"} top={"11px"} left={2}>
          <FiSearch fontSize={20} />
        </Box>
        {/* Search results */}
        {searchResults.length > 0 && (
          <Box
            pos={"absolute"}
            width={"100%"}
            backgroundColor={"white"}
            boxShadow={"md"}
            zIndex={1}
            borderRadius={"md"}
            mt={2}
          >
            {searchResults.map((user) => (
              <Box
                key={user._id}
                padding={2}
                borderBottom={"1px solid #ddd"}
                _hover={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
                onClick={() => {
                  setSearchUser("");
                  setSearchResults([]);
                  navigate(`/profile/${user._id}`);
                }}
              >
                <Text>{user.fullname}</Text>
              </Box>
            ))}
          </Box>
        )}
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
