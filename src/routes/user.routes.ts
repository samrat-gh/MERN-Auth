import { Router } from "express";
import {
  loginUser,
  LogoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { VerifyJWT } from "../controllers/auth.middleware";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      // name must match in the frontend field
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(VerifyJWT, LogoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
