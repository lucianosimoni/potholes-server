import express from "express";
import {
  potholeCreate,
  potholeGet,
  potholeUpdate,
  potholeDelete,
} from "../controllers/potholesController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, potholeCreate);
router.get("/", potholeGet);
router.put("/:potholeId", authenticate, potholeUpdate);
router.delete("/:potholeId", authenticate, potholeDelete);

export default router;
