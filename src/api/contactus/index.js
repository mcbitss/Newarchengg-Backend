import { Router } from "express";
import { token } from "../../services/passport";
import { create, deleteContactUs, getList, updateContactUsAdmin } from "./controller";

const router = new Router();

router.post("/add", create);

router.get("/list", getList);

router.put("/update-contact/:id", token(), updateContactUsAdmin);

router.delete("/:id", token(), deleteContactUs);

export default router;
