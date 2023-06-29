import express from "express";
import {
  userGet,
  userUpdate,
  userDelete,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", userGet);
router.put("/:userId", userUpdate);
router.delete("/:userId", userDelete);

export default router;
