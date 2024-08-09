/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import PostCard from "../components/PostCard/PostCard";
import { getRecommendedFeed } from "../api/recommendationsFeed";
import {
  createPostComment,
  deletePost,
  getPostComment,
  getPostLike,
  likePost,
} from "../api/post";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [commentOnPost, setCommentOnPost] = useState([]);
  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const getFeed = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedFeed(profile_info._id); // Adjust the API call as needed
      setPosts(data.data.data);
    } catch (error) {
      console.error("Failed to fetch recommended feed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    await deletePost(id);
    getFeed();
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
    getFeed();
    fetchLikes();
  }, []);

  return (
    <Box width={"30%"} mt={"7rem"} mx={"auto"}>
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

export default HomePage;
