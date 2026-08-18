import { Router } from "express";
import { token } from "../../services/passport";
import { createProject, deleteProject, getList, updateProject } from "./controller";

const router = new Router();

router.get("/", getList);
router.post("/", token(), createProject);
router.put("/:id", token(), updateProject);
router.delete("/:id", token(), deleteProject);

export default router;
