import { v2 as Cloudinary } from "cloudinary";
import stream from "stream";
import { promisify } from "util";

const streamUpload = promisify(Cloudinary.uploader.upload_stream);

class CloudinaryService {
  constructor() {
    Cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadToCloudinary(fileBuffer, fileFormat) {
    try {
      if (!fileBuffer) {
        throw new Error("Invalid file buffer");
      }

      const uploadStream = stream.PassThrough(); // Create a stream for Cloudinary upload
      const uploadPromise = streamUpload(uploadStream, {
        resource_type: "auto",
        format: fileFormat, // Optional: specify format (jpg, png, etc.)
        access_mode: "public",
      });

      uploadStream.end(fileBuffer); // Write the file buffer to stream

      const response = await uploadPromise;
      if (!response) return null;
      console.log("File uploaded successfully:", response.secure_url);

      return response.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
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
