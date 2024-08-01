/* eslint-disable react/prop-types */
import { Box, Text } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import "./User.css";
import Cookies from "js-cookie";
import { IoLogOutSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const User = ({ setProfileToggle }) => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    Cookies.remove("uid");
    navigate("/login");
  };
  return (
    <Box
      className="user"
      display={"flex"}
      flexDir={"column"}
      gap={3}
      letterSpacing={2}
      fontWeight={"bold"}
    >
      <NavLink to={"/profile"}>
        <Box
          _hover={{ bgColor: "rgb(255, 239, 239, 0.8)" }}
          padding={2}
          borderRadius={5}
          transition={"0.2s all ease-in"}
          display={"flex"}
          alignItems={"center"}
          gap={2}
          onClick={() => setProfileToggle(false)}
        >
          <Box fontSize={"20px"}>
            <FaUserCircle />
          </Box>
          <Text fontSize={"18px"}>Profile</Text>
        </Box>
      </NavLink>
      <Box
        _hover={{ bgColor: "rgb(255, 239, 239, 0.8)" }}
        padding={2}
        borderRadius={5}
        transition={"0.1s all ease-in"}
        display={"flex"}
        alignItems={"center"}
        gap={2}
        onClick={() => {
          setProfileToggle(false);
          logoutHandler();
        }}
      >
        <Box fontSize={"20px"}>
          <IoLogOutSharp />
        </Box>
        <Text>Logout</Text>
      </Box>
    </Box>
  );
};

export default User;
