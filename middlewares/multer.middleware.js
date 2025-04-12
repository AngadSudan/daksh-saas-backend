import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(pdf|pptx|ppt|png|jpg|jpeg)$/i; // Case-insensitive

  if (!allowedExtensions.test(file.originalname)) {
    req.fileValidationError =
      "Only PDFs, PPTs, and images (PNG, JPG, JPEG) are allowed!";
    return cb(new Error(req.fileValidationError), false);
  }

  cb(null, true);
};

// Convert to Memory Storage instead of diskStorage
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export default upload;
