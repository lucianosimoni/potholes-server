import express from "express";
import {
  potholeCreate,
  potholeGet,
  potholeUpdate,
  potholeDelete,
} from "../controllers/potholesController.js";

const router = express.Router();

router.post("/", potholeCreate);
router.get("/", potholeGet);
router.put("/:potholeId", potholeUpdate);
router.delete("/:potholeId", potholeDelete);

export default router;
