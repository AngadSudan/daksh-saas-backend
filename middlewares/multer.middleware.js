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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
