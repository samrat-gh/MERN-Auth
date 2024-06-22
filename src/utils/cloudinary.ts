import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  // Upload an image
  try {
    if (!localFilePath) {
      return null;
    } else {
      const uploadResult = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      console.log("Uploaded ", uploadResult);
      console.log(uploadResult.url);

      return uploadResult;
    }
  } catch (error: any) {
    // Remove the temporary file from local server as upload got failed
    fs.unlinkSync(localFilePath);

    return null;
  }
};

export { uploadOnCloudinary };
