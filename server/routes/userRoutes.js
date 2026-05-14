import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getProfile, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getProfile);

export default router;

