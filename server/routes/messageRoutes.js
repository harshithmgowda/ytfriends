import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload, { uploadSingleImage } from "../middleware/uploadMiddleware.js";
import { getRoomMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/room/:roomId", protect, getRoomMessages);
router.post("/send", protect, sendMessage);
router.post("/upload", protect, uploadSingleImage, sendMessage);

export default router;

