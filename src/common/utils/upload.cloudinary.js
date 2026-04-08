import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import  apiError  from "./api-error.js";

const uploadOnCloudinary = async (LocalFilePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_KEY,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  if (!(LocalFilePath || folder)) {
    throw apiError.badRequest(
      "please provide a valid file path and folder name..",
    );
  }

  const response = await cloudinary.uploader.upload(LocalFilePath, {
    folder: `taskManager/avatars`,
    resource_type: "image",
  });

  if (!response) {
    throw apiError.serverError(
      "something went wrong while uploading on cloudinary..",
    );
  }

  fs.unlinkSync(LocalFilePath);
  return { url: response.url, publicId: response.public_id };
};

export { uploadOnCloudinary };
