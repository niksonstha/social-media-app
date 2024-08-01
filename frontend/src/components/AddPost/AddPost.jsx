/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getProfilePicture } from "../../api/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { RiGalleryFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import PostUploadModal from "../PostUploadModal/PostUploadModal";
import Backdrop from "../Backdrop/Backdrop";

const AddPost = () => {
  const [profilePicture, setprofilePicture] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      mt={5}
      display={"flex"}
      alignItems={"center"}
      gap={3}
      pos={"relative"}
    >
      <Box>
        <NavLink to="/">
          <Image
            src={profilePicture ? profilePicture : "/default_profile.jpg"}
            height={"50px"}
            width={"50px"}
            rounded={"50%"}
            objectFit={"cover"}
            alt="Profile Picture"
          />
        </NavLink>
      </Box>
      <Box
        width={"100%"}
        rounded={"50px"}
        bgColor={"#e0d7d7"}
        cursor={"pointer"}
        _hover={{ bgColor: "#e8dfdf" }}
        onClick={() => setIsModalOpen(true)}
      >
        <Text padding={"10px"}>What&apos;s on your mind?</Text>
      </Box>
      <Box cursor={"pointer"} onClick={() => setIsModalOpen(true)}>
        <Box fontSize={"30px"}>
          <RiGalleryFill />
        </Box>
        <Text>Photo</Text>
      </Box>

      {isModalOpen && (
        <Backdrop onClose={() => setIsModalOpen(false)}>
          <Box
            pos={"absolute"}
            top={"50%"}
            left={"50%"}
            transform="translate(-50%, -50%)"
            onClick={(e) => e.stopPropagation()}
          >
            <PostUploadModal setIsModalOpen={setIsModalOpen} />
          </Box>
        </Backdrop>
      )}
    </Box>
  );
};

export default AddPost;
