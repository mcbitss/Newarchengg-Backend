import multer from "multer";
import { CustomError } from "../../services/Util/Util";

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

const fileFilter = (req, file, callback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new CustomError(`Unsupported file type: ${file.mimetype}`, "file", 400));
  }
};

export const uploadMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024, files: 20 }
});
