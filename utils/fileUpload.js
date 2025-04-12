import { v2 as Cloudinary } from "cloudinary";
import fs from "fs/promises";
import os from "os";
import path from "path";

class CloudinaryService {
  constructor() {
    Cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadToCloudinary(file, folder, filename) {
    try {
      if (!file) throw new Error("No file provided");

      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, file.originalname);

      const buffer = Buffer.from(await file.buffer);
      await fs.writeFile(tempFilePath, buffer);

      const mimeType = file.mimetype;

      // Upload the file to Cloudinary
      const response = await Cloudinary.uploader.upload(tempFilePath, {
        resource_type: "auto",
        // flags: "attachment",
        folder: folder,
        public_id: filename,
        access_mode: "public",
      });

      await fs.unlink(tempFilePath);

      return response.secure_url;
    } catch (error) {
      console.error("Error during Cloudinary upload:", error);
      throw error;
    }
  }

  async deleteCloudinary(fileUrl) {
    try {
      console.log("Deleting file from Cloudinary:", fileUrl);
      if (!fileUrl) throw new Error("No URL provided");

      const publicId = this.extractPublicId(fileUrl);
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

  extractPublicId(fileUrl) {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      return pathname
        .split("/")
        .slice(2)
        .join("/")
        .replace(/\.[^/.]+$/, "");
    } catch (error) {
      console.error("Invalid Cloudinary URL:", fileUrl);
      return null;
    }
  }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
