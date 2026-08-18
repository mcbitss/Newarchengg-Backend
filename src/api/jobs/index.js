import { Router } from "express";
import { uploadDocument } from "../../services/multer";
import { token } from "../../services/passport";
import { applyJob } from "../applications/controller";
import { createJob, deleteJob, getAdminList, getById, getList, updateJob } from "./controller";

const router = new Router();

router.get("/list", getList);
router.get("/admin/list", token(), getAdminList);
router.get("/:id", getById);
router.post("/create", token(), createJob);
router.post("/:id/apply", uploadDocument.single("resume"), applyJob);
router.put("/update/:id", token(), updateJob);
router.delete("/:id", token(), deleteJob);

export default router;
