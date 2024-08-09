/* eslint-disable react-hooks/exhaustive-deps */
// components/UserPost.js
import { Box, Spinner } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  getPost,
  deletePost,
  likePost,
  getPostLike,
  createPostComment,
  getPostComment,
} from "../../api/post";
import PostCard from "../PostCard/PostCard";
import { PostsContext } from "../../store/PostsContext";

const UserPost = () => {
  const { posts, setPosts } = useContext(PostsContext);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [commentOnPost, setCommentOnPost] = useState([]);
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

  const handleLikePost = async (postId) => {
    await likePost(profile_info._id, postId);
    fetchLikes();
  };

  const handleCommentSubmit = async (postId, comment) => {
    await createPostComment(profile_info._id, postId, comment);
    fetchPostComments(postId);
  };

  const fetchLikes = async () => {
    const data = await getPostLike();
    setLikes(data.data.data);
  };

  const fetchPostComments = async (postId) => {
    const comments = await getPostComment(postId);
    setCommentOnPost(comments.data.data);
  };

  useEffect(() => {
    getUserPost();
    fetchLikes();
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
        posts.map((post, index) => (
          <PostCard
            key={index}
            post={post}
            onDelete={handleDeletePost}
            onLike={handleLikePost}
            onCommentSubmit={handleCommentSubmit}
            comments={commentOnPost}
            fetchComments={fetchPostComments}
            likes={likes}
            profileInfo={profile_info}
            loading={loading}
          />
        ))
      )}
    </Box>
  );
};

export default UserPost;
