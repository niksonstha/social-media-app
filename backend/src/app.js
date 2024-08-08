import "dotenv/config";
import { connection } from "./db/connection.js";
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import friendRequest from "./routes/friendRequest.routes.js";
import postLikeRoutes from "./routes/like.routes.js";
import postCommentRoutes from "./routes/comment.routes.js";
import cors from "cors";

const app = express();

// ? Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// ? Mongodb connection
connection()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((error) => {
    console.log(error);
  });

// ? Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/friendRequest", friendRequest);
app.use("/api/v1/postLike", postLikeRoutes);
app.use("/api/v1/comment", postCommentRoutes);

// ? server start
app.listen(process.env.PORT, () => {
  console.log(`App is running in port https://localhost:${process.env.PORT}`);
});
