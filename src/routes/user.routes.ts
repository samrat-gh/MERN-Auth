import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router();

//@ts-ignore
// router.route("register").post(registerUser);
router.route("/register").post(registerUser);

export default router;
