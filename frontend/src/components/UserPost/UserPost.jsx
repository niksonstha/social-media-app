/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Image, Text, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PostsContext } from "../../store/PostsContext";
import { getPost } from "../../api/post";
import { useLocation } from "react-router-dom";

const UserPost = () => {
  const { posts, setPosts } = useContext(PostsContext);
  const [loading, setLoading] = useState(true);

  const userId = useLocation();

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    getUserPost();
  }, []);

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
                <Text fontSize={"0.7rem"}>
                  {formatDate(post?.userId.createdAt)}
                </Text>
              </Box>
            </Box>
            <Box mt={3}>
              <Text>{post?.caption}</Text>
              {post?.image && <Image src={post?.image} height={"100%"} />}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserPost;
