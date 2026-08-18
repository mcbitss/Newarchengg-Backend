import { Router } from "express";
import { token, validateToken } from "../../services/passport";
import { changePassword, getUsers } from "./controller";

const router = new Router();

router.get("/byToken", validateToken());

router.get("/list", token(), getUsers);

router.put("/change-password", token(), changePassword);

export default router;
