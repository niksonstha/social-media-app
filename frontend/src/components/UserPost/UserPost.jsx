import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getPost } from "../../api/post";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const UserPost = () => {
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const getUserPost = async () => {
    try {
      const data = await getPost(profile_info._id);
      setUserPost(data.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserPost();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Box>
      {userPost.map((post) => (
        <Box key={post._id} bgColor={"#FFEFEF"} rounded={5} padding={5} m={2}>
          <Box display={"flex"} gap={4} alignItems={"center"}>
            <Image
              src={post.userId.profilePicture}
              height={"50px"}
              width={"50px"}
              rounded={"50%"}
              alt="post image"
            />
            <Box display={"flex"} flexDir={"column"}>
              <Text>{post.userId.fullname}</Text>
              <Text fontSize={"0.7rem"}>
                {formatDate(post.userId.createdAt)}
              </Text>
            </Box>
          </Box>
          <Box mt={3}>
            <Text>{post.caption}</Text>
            {post.image && <Image src={post.image} height={"100%"} />}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default UserPost;
