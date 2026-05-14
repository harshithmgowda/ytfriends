import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createPost, getFeed, toggleLikePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getFeed);
router.post("/", protect, createPost);
router.put("/:id/like", protect, toggleLikePost);

export default router;

