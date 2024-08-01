import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

const cloudnaryUpload = async (cloudImageUrl) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(cloudImageUrl, {
      folder: "social-media-app",
      resource_type: "image",
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
};

export default cloudnaryUpload;
