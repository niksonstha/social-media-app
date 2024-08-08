/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  useToast,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../api/user";
import Cookies from "js-cookie";
import { useEffect } from "react";

// Define the validation schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const toast = useToast();

  const onLoginHandler = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      if (response.data.success) {
        toast({
          title: "Login successful.",
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Login failed.",
          description: response.data.error || "Password incorrect",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed.",
        description: error.response?.data?.error || "Password incorrect",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const validateUser = () => {
    const cookie = Cookies.get("uid");

    if (cookie) {
      navigate("/");
    }
  };

  useEffect(() => {
    validateUser();
  }, [validateUser]);

  return (
    <Box display={"flex"} justifyContent={"center"} height={"100vh"} mt={5}>
      <Box height={"50vh"} width={["90%", "80%", "60%", "40%"]}>
        <Box display={"flex"} flexDirection={"column"} gap={5}>
          <Box
            as="h1"
            fontSize={["1.5rem", "2rem"]}
            fontWeight={"bold"}
            letterSpacing={5}
            textAlign={"center"}
          >
            LOGIN
          </Box>

          <Box
            bgColor={"white"}
            padding={5}
            rounded={10}
            display={"flex"}
            flexDirection={"column"}
            gap={5}
          >
            <FormControl isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" {...register("email")} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>
        <Box display={"flex"} flexDir={"column"}>
          <Button mt={5} onClick={handleSubmit(onLoginHandler)}>
            Login
          </Button>
        </Box>
        <Box mt={5} width={"max-content"}>
          <NavLink to={"/register"}>
            <Text
              fontSize={["1rem"]}
              _hover={{ color: "blue" }}
              transition={"all 0.2s ease-in"}
            >
              Create new account
            </Text>
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
