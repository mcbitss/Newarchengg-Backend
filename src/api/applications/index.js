import { Router } from "express";
import { token } from "../../services/passport";
import {
  getApplicationResume,
  getApplicationsByJob,
  listApplications,
  updateApplication
} from "./controller";

const router = new Router();

router.get("/list", token(), listApplications);
router.get("/job/:id", token(), getApplicationsByJob);
router.put("/update/:id", token(), updateApplication);
router.get("/:id/resume", token(), getApplicationResume);

export default router;
