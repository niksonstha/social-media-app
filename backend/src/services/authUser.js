import jwt from "jsonwebtoken";
const secretKey = "nikson@#$%!shrestha@$&!*";

export const setUser = (user) => {
  const { _id, email, fullname, username, profilePicture } = user;
  return jwt.sign(
    { _id, email, fullname, username, profilePicture },
    secretKey,
    {
      expiresIn: "1h",
    }
  );
};
