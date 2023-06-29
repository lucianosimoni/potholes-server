import express from "express";
import {
  userLogin,
  userRegister,
  jwtCheck,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/check-jwt", jwtCheck);

export default router;
