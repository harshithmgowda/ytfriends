import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createRoom,
  getMyRooms,
  getRoomByKey,
  joinRoom,
  leaveRoom,
  updateRoomState
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/my", protect, getMyRooms);
router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.get("/:roomKey", protect, getRoomByKey);
router.put("/:roomKey/state", protect, updateRoomState);
router.post("/leave", protect, leaveRoom);

export default router;

