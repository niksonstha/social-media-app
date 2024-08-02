/* eslint-disable react/prop-types */
import { Box, Heading, Textarea, Button, Icon, Image } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { createPost } from "../../api/post";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { PostsContext } from "../../store/PostsContext";

const PostUploadModal = ({ setIsModalOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const { addPost } = useContext(PostsContext);

  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const handleImageDisplay = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null); // Clear the file object as well
  };

  const uploadImage = async () => {
    let data = await createPost(caption, selectedImageFile, profile_info._id);
    addPost(data.data.getPostDetail);
  };

  // Check if both caption and image are provided
  const isPostButtonDisabled = !caption.trim() || !selectedImageFile;

  return (
    <Box
      height={"auto"}
      bgColor={"white"}
      width={"50vh"}
      rounded={10}
      pos={"relative"}
      zIndex={2}
      userSelect={"none"}
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
      p={5}
    >
      <Heading textAlign={"center"} mt={2} mb={2}>
        Create a new post
      </Heading>
      <Box borderBottom={"1px solid rgba(255, 255, 255, 0.5)"} />
      {/* Caption */}
      <Box mt={5}>
        <Textarea
          placeholder="What's on your mind?"
          autoFocus
          resize="none"
          size="sm"
          bgColor="transparent"
          border="none"
          outline="none"
          width="100%"
          padding="8px"
          fontSize={"1.2rem"}
          _focus={{ boxShadow: "none" }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </Box>
      {/* Display image */}
      {selectedImage && (
        <Box mt={5} position="relative">
          <Image
            src={selectedImage}
            alt="Selected"
            width="100%"
            rounded="md"
            name="postImage"
          />
          <Button
            position="absolute"
            top="10px"
            right="10px"
            colorScheme="red"
            size="sm"
            onClick={handleRemoveImage}
          >
            <Icon as={FiTrash2} />
          </Button>
        </Box>
      )}
      {/* Upload photo */}
      <Box
        mt={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={3}
      >
        <Button
          as="label"
          htmlFor="imageUpload"
          leftIcon={<Icon as={FiUpload} />}
          colorScheme="teal"
          variant="outline"
          cursor={"pointer"}
        >
          Select Photo
        </Button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageDisplay}
        />
        <Button
          colorScheme="teal"
          variant="outline"
          cursor={"pointer"}
          onClick={() => {
            uploadImage();
            setIsModalOpen(false);
          }}
          isDisabled={isPostButtonDisabled}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default PostUploadModal;
