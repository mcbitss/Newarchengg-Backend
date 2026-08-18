import fs from "fs";
import multer from "multer";
import path from "path";
import { BASE_DIR_PATH } from "../../config";
import { CustomError } from "../Util/Util";

const documentMemoryStorage = multer.memoryStorage();

// const documentStorage = multer.diskStorage({
//   destination(req, file, callback) {
//     const companyId = req.query.company || req.user?.company || "default";
//     const folderPath = path.join(BASE_DIR_PATH, "assets", "temp_documents", companyId.toString());
//     fs.mkdirSync(folderPath, { recursive: true });
//     callback(null, folderPath);
//   },
//   filename(req, file, callback) {
//     callback(null, `${Date.now()}_${file.originalname}`);
//   }
// });

const documentStorageWithUserId = multer.diskStorage({
  destination(req, file, callback) {
    const folderPath = path.join(
      BASE_DIR_PATH,
      "assets",
      "temp_doc",
      req.query.company.toString(),
      req.user.id.toString()
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    callback(null, folderPath);
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}_${path.basename(file.originalname)}`);
  }
});

const templateDocumentStorage = multer.diskStorage({
  destination(req, file, callback) {
    const folderPath = path.join(
      BASE_DIR_PATH,
      "assets",
      "documents",
      req.query.company.toString(),
      "templates"
    );
    fs.mkdirSync(folderPath, { recursive: true });
    callback(null, folderPath);
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}_${path.basename(file.originalname)}`);
  }
});

const fileFilter = (req, file, callback) => {
  const supportedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain", // .txt
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // older Excel formats
    "text/csv" // .csv
  ];

  if (supportedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    console.log("❌ Rejected file:", file.originalname, "type:", file.mimetype);
    callback(new CustomError(`Unsupported file type: ${file.mimetype}`, "file", 400));
  }
};

export const uploadDocument = multer({
  storage: documentMemoryStorage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter
});

export const uploadDocumentPathUser = multer({
  storage: documentStorageWithUserId,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter
});

export const uploadTemplateDocument = multer({
  storage: templateDocumentStorage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter
});
