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
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useContext, useEffect, useState, useRef } from "react";
import { PostsContext } from "../../store/PostsContext";
import {
  createPostComment,
  deletePost,
  getPost,
  getPostComment,
  getPostLike,
  likePost,
} from "../../api/post";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const UserPost = () => {
  const { posts, setPosts } = useContext(PostsContext);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [likes, setLikes] = useState([]);
  const [openCommentBoxId, setOpenCommentBoxId] = useState(null); // Track open comment box by post ID
  const [comment, setComment] = useState(""); // State to hold the comment input
  const [commentOnPost, setCommentOnPost] = useState([]);
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
    await likePost(profile_info._id, postId);
    fetchLike();
  };

  const fetchLike = async () => {
    let data = await getPostLike();
    setLikes(data.data.data);
  };

  useEffect(() => {
    getUserPost();
    fetchLike();
  }, [userId]);

  // Map likes to posts
  const postsWithLikes = posts?.map((post) => {
    const postLikes = likes.find((like) => like.postId === post._id);
    return {
      ...post,
      likeCount: postLikes ? postLikes.like : 0,
    };
  });

  // Toggle comment box visibility
  const toggleCommentBox = (postId) => {
    if (openCommentBoxId === postId) {
      setOpenCommentBoxId(null); // Close if already open
    } else {
      setOpenCommentBoxId(postId); // Open new one
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (comment.trim()) {
      // Create a new comment in the backend
      await createPostComment(profile_info._id, postId, comment);

      fetchPostComment(postId);

      setComment("");
    }
  };

  const fetchPostComment = async (id) => {
    let comments = await getPostComment(id);
    setCommentOnPost(comments.data.data);
  };

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
        postsWithLikes?.map((post, index) => (
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
                onClick={() => {
                  handleLike(post._id);
                }}
              >
                <AiFillLike />
                <Text>Like {post.likeCount}</Text>
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
                onClick={() => {
                  toggleCommentBox(post._id);
                  fetchPostComment(post._id);
                }}
              >
                <FaComment />
                <Text>Comment</Text>
              </Box>
            </Box>
            {openCommentBoxId === post._id && (
              <Box mt={3}>
                {commentOnPost
                  .filter((c) => c?.postId === post._id)
                  .map((commentItem) =>
                    commentItem.comment.map((text, idx) => (
                      <Box
                        key={`${commentItem._id}-${idx}`}
                        bgColor={"#F0EBE3"}
                        rounded={4}
                        mt={2}
                        p={3}
                        display={"flex"}
                        alignItems={"center"}
                        gap={3}
                      >
                        <Image
                          src={commentItem.userId.profilePicture}
                          height={"30px"}
                          width={"30px"}
                          rounded={"50%"}
                          alt="user image"
                        />
                        <Box>
                          <Text fontWeight={"bold"}>
                            {commentItem.userId.fullname}
                          </Text>
                          <Text>{text}</Text>
                        </Box>
                      </Box>
                    ))
                  )}
                {/* Comment Input Box */}
                <Box
                  bgColor={"#F0EBE3"}
                  rounded={4}
                  mt={3}
                  p={3}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Input
                    flexGrow={1}
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    _focus={{ boxShadow: "none" }}
                    border="none"
                    outline="none"
                  />
                  <IconButton
                    aria-label="Submit comment"
                    icon={<FiSend />}
                    onClick={() => {
                      handleCommentSubmit(post._id);
                    }}
                    ml={2}
                    colorScheme="blue"
                  />
                </Box>
              </Box>
            )}
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
