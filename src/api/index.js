import { Router } from "express";
import applications from "./applications";
import auth from "./auth";
import contactus from "./contactus";
import jobs from "./jobs";
import media from "./media";
import partners from "./partners";
import projects from "./projects";
import subscribers from "./subscribers";
import tokens from "./tokens";
import user from "./users";

const router = new Router();

router.use("/auth", auth);
router.use("/users", user);
router.use("/tokens", tokens);
router.use("/media", media);
router.use("/jobs", jobs);
router.use("/applications", applications);

router.use("/contactus", contactus);
router.use("/partners", partners);
router.use("/projects", projects);
router.use("/subscribers", subscribers);

export default router;
