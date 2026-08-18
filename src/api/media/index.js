import { Router } from "express";
import { token } from "../../services/passport";
import { deleteMedia, listMedia, uploadFiles } from "./controller";
import { uploadMedia } from "./multer";

const router = new Router();

router.get("/list", token(), listMedia);
router.post("/upload", token(), uploadMedia.array("files", 20), uploadFiles);
router.delete("/:id", token(), deleteMedia);

export default router;
