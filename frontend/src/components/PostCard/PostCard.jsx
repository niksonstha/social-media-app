/* eslint-disable react/prop-types */
// components/PostCard.js
import {
  Box,
  Image,
  Text,
  IconButton,
  Input,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const PostCard = ({
  post,
  onDelete,
  onLike,
  onCommentSubmit,
  comments,
  fetchComments,
  likes,
  profileInfo,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const cancelRef = useRef();

  const openDeleteDialog = () => setIsOpen(true);
  const closeDeleteDialog = () => setIsOpen(false);

  const handleDelete = async () => {
    await onDelete(post._id);
    closeDeleteDialog();
  };

  const handleLike = () => {
    onLike(post._id);
  };

  const handleCommentBoxToggle = () => {
    setOpenCommentBox(!openCommentBox);
    if (!openCommentBox) {
      fetchComments(post._id);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      onCommentSubmit(post._id, comment);
      setComment("");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const postLikes = likes.find((like) => like.postId === post._id);

  return (
    <Box bgColor={"#FFEFEF"} rounded={5} padding={5} m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Box>
      ) : (
        <>
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
            {profileInfo._id === post.userId._id && (
              <Box
                cursor={"pointer"}
                color={"red"}
                fontSize={"1.2rem"}
                onClick={openDeleteDialog}
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
              _hover={{ bgColor: "white" }}
              onClick={handleLike}
            >
              <AiFillLike />
              <Text>Like {postLikes ? postLikes.like : 0}</Text>
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
              _hover={{ bgColor: "white" }}
              onClick={handleCommentBoxToggle}
            >
              <FaComment />
              <Text>Comment</Text>
            </Box>
          </Box>
          {openCommentBox && (
            <Box mt={3}>
              {comments
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
                  onClick={handleCommentSubmit}
                  ml={2}
                  colorScheme="blue"
                />
              </Box>
            </Box>
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
                  <Button colorScheme="red" onClick={handleDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </Box>
  );
};

export default PostCard;
