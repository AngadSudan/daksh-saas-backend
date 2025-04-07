import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(pdf|pptx|png|jpg|jpeg)$/i; // Case-insensitive

  if (!allowedExtensions.test(file.originalname)) {
    req.fileValidationError =
      "Only PDFs, PPTs, and images (PNG, JPG, JPEG) are allowed!";
    return cb(new Error(req.fileValidationError), false);
  }

  cb(null, true);
};

// Convert to Memory Storage instead of diskStorage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
});

export default upload;
