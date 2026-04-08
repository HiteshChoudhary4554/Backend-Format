import { v2 as cloudinary } from "cloudinary";
import { apiError } from "./api-error.js";

const removeCloudinaryImage = async (publicId) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_KEY,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  if (!publicId) {
    throw apiError.badRequest("please provide a valid public id..");
  }

  const response = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (!response) {
    throw apiError.serverError(
      "something went wrong while deleting cloudinary assets..",
    );
  }
  return response;
};

export { removeCloudinaryImage };
