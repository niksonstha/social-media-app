/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Image,
  Text,
  Spinner,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useContext, useEffect, useState, useRef } from "react";
import { PostsContext } from "../../store/PostsContext";
import { deletePost, getPost, likePost } from "../../api/post";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

const UserPost = () => {
  const { posts, setPosts } = useContext(PostsContext);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [like, setLike] = useState();
  const cancelRef = useRef();

  const userId = useLocation();
  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const getUserPost = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const data = await getPost(userId.pathname.split("/")[2]);
      setPosts(data.data.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleDeletePost = async (id) => {
    await deletePost(id);
    getUserPost();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openDeleteDialog = (id) => {
    setDeletePostId(id);
    setIsOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsOpen(false);
    setDeletePostId(null);
  };

  const confirmDeletePost = async () => {
    if (deletePostId) {
      await handleDeletePost(deletePostId);
    }
    closeDeleteDialog();
  };

  const handleLike = async (postId) => {
    let like = await likePost(profile_info._id, postId);
    console.log(like.data.likeCount);
    setLike(like.data.likeCount);
  };

  useEffect(() => {
    getUserPost();
  }, [userId]);

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        posts?.map((post, index) => (
          <Box key={index} bgColor={"#FFEFEF"} rounded={5} padding={5} m={2}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} gap={4} alignItems={"center"}>
                <Image
                  src={post?.userId.profilePicture}
                  height={"50px"}
                  width={"50px"}
                  rounded={"50%"}
                  alt="post image"
                />
                <Box display={"flex"} flexDir={"column"}>
                  <Text>{post?.userId.fullname}</Text>
                  <Text fontSize={"0.7rem"}>{formatDate(post?.createdAt)}</Text>
                </Box>
              </Box>
              {profile_info._id === post.userId._id && (
                <Box
                  cursor={"pointer"}
                  color={"red"}
                  fontSize={"1.2rem"}
                  onClick={() => openDeleteDialog(post._id)}
                >
                  <MdDelete />
                </Box>
              )}
            </Box>
            <Box mt={3}>
              <Text>{post?.caption}</Text>
              {post?.image && <Image src={post?.image} height={"100%"} />}
            </Box>
            <Box>
              <Text>{like}</Text>
            </Box>
            <Box display={"flex"} mt={2} gap={2} alignContent={"center"}>
              <Box
                bgColor={"#F0EBE3"}
                flexGrow={1}
                cursor={"pointer"}
                padding={2}
                fontSize={"1.3rem"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={2}
                userSelect={"none"}
                _hover={{
                  bgColor: "white",
                }}
                onClick={() => handleLike(post._id)}
              >
                <AiFillLike />
                <Text>Like</Text>
              </Box>
              <Box
                bgColor={"#F0EBE3"}
                flexGrow={1}
                cursor={"pointer"}
                padding={2}
                fontSize={"1.3rem"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={2}
                userSelect={"none"}
                _hover={{
                  bgColor: "white",
                }}
              >
                <FaComment />
                <Text>Comment</Text>
              </Box>
            </Box>
          </Box>
        ))
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this post? You can&apos;t undo
              this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeletePost} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UserPost;
