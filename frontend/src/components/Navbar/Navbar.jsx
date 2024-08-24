/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Image, Text } from "@chakra-ui/react";
import "./Navbar.css";
import { FiSearch } from "react-icons/fi";
import User from "../User/User";
import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { getProfileDetail, getUsersSearch } from "../../api/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Remove the curly braces around jwtDecode
import { debounce } from "lodash";
import FriendNotification from "../Notification/FriendNotification";
import { getFriendRequestNotification } from "../../api/friend";
import { FaUserFriends } from "react-icons/fa";

const Navbar = () => {
  const [profileToggle, setProfileToggle] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [friendRequests, setfriendRequests] = useState([]);

  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const fetchRequestedFriend = async () => {
    let data = await getFriendRequestNotification(profile_info._id);
    setfriendRequests(data.data.data);
  };

  const getProfileImage = async () => {
    let res = await getProfileDetail(profile_info._id);
    setProfilePicture(res.data.user.profilePicture);
  };

  const fetchSearchUsers = async (searchTerm) => {
    if (searchTerm) {
      const data = await getUsersSearch(searchTerm);
      setUserSearchResults(data.data);
    } else {
      setUserSearchResults([]);
    }
  };

  // Use useCallback to memoize the debounced function
  const debouncedFetchSearchUsers = useCallback(
    debounce((value) => {
      fetchSearchUsers(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setUserSearch(value);
    debouncedFetchSearchUsers(value);
  };

  useEffect(() => {
    getProfileImage();
    fetchRequestedFriend();
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
          value={userSearch}
          onChange={handleSearchChange}
        />
        <Box pos={"absolute"} top={"11px"} left={2}>
          <FiSearch fontSize={20} />
        </Box>

        {/* search result */}
        {userSearchResults.length > 0 && (
          <Box
            pos={"absolute"}
            bgColor={"white"}
            top={"4rem"}
            width={"100%"}
            padding={"10px"}
            rounded={"10px"}
            className="search__output"
            display={"flex"}
            flexDir={"column"}
            gap={5}
          >
            {userSearchResults.map((item, index) => (
              <Box
                key={index}
                _hover={{
                  bgColor: "rgb(243, 208, 215,0.4)",
                }}
                padding={2}
                rounded={"10px"}
                onClick={() => {
                  setUserSearch("");
                  setUserSearchResults([]);
                }}
              >
                <NavLink to={`/profile/${item._id}`}>
                  <Box display={"flex"} alignItems={"center"} gap={5}>
                    <Image
                      src={item.profilePicture}
                      alt={item._id}
                      height={"50px"}
                      width={"50px"}
                      rounded={"50%"}
                    />
                    <Text>{item.fullname}</Text>
                  </Box>
                </NavLink>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* profile */}
      <Box
        cursor={"pointer"}
        pos={"relative"}
        display={"flex"}
        alignItems={"center"}
        gap={8}
      >
        {/* friend request notification */}
        {friendRequests.length > 0 && (
          <Box
            fontSize={"2rem"}
            rounded={"50%"}
            padding={"6px"}
            onClick={() => {
              setNotificationToggle(!notificationToggle);
              setProfileToggle(false);
            }}
            pos={"relative"}
            _hover={{ bgColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <FaUserFriends />
            <Box
              pos={"absolute"}
              top={-2}
              right={-1}
              bgColor={"red"}
              color={"white"}
              fontSize={"0.7rem"}
              fontWeight={"bold"}
              padding={2}
              rounded={"50%"}
              textAlign={"center"}
              height="20px"
              width="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text>{friendRequests.length}</Text>
            </Box>
          </Box>
        )}
        {notificationToggle && (
          <Box pos={"absolute"} top={14} right={2} width={"max-content"}>
            {friendRequests.length > 0 && (
              <FriendNotification
                friendRequests={friendRequests}
                profileId={profile_info._id}
                fetchRequestedFriend={fetchRequestedFriend}
              />
            )}
          </Box>
        )}
        <Box
          onClick={() => {
            setProfileToggle(!profileToggle);
            setNotificationToggle(false);
          }}
        >
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
