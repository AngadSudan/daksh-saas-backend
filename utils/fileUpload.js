import { v2 as Cloudinary } from "cloudinary";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";

const streamUpload = promisify(Cloudinary.uploader.upload_stream);

function extractPublicId(fileUrl) {
  try {
    const url = new URL(fileUrl);
    const pathname = url.pathname;

    const publicId = pathname
      .split("/")
      .slice(2)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.error("Invalid Cloudinary URL:", fileUrl);
    return null;
  }
}

class CloudinaryService {
  constructor() {
    Cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadToCloudinary(filepath) {
    try {
      if (!filepath || !fs.existsSync(filepath)) {
        console.error("File path is invalid or does not exist:", filepath);
        throw new Error("Invalid file path");
      }

      const response = await Cloudinary.uploader.upload(filepath, {
        resource_type: "auto",
        // flags: "attachment",
        access_mode: "public",
      });

      console.log("File uploaded successfully:", response.secure_url);

      // Delete file after successful upload
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      return response.asset_id;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);

      // Delete file if it still exists after failure
      if (filepath && fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      return new Error("error in uploading file to cloudinary");
    }
  }

  async deleteCloudinary(fileUrl) {
    try {
      console.log("Deleting file from Cloudinary:", fileUrl);
      if (!fileUrl) throw new Error("No URL provided");

      const publicId = extractPublicId(fileUrl);

      if (!publicId) throw new Error("Invalid Cloudinary URL");

      const response = await Cloudinary.uploader.destroy(publicId);

      if (response.result === "ok") {
        console.log("File deleted successfully from Cloudinary.");
        return { success: true, message: "File deleted successfully" };
      } else {
        console.warn("Cloudinary deletion result:", response.result);
        return { success: false, message: "Failed to delete file" };
      }
    } catch (error) {
      console.error("Error during Cloudinary deletion:", error);
      throw error;
    }
  }
}
const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
