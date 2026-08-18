import { Router } from "express";
import { token } from "../../services/passport";
import { create, getList } from "./controller";

const router = new Router();

router.post("/add", create);

router.get("/list", token(), getList);

export default router;
