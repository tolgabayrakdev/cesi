import express from "express";
import { createRoom, joinRoom, getRooms, leaveRoom } from "../controller/room-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/", verifyToken, getRooms);
router.post("/", verifyToken, createRoom);
router.post("/join", verifyToken, joinRoom);
router.post("/:roomId/leave", verifyToken, leaveRoom);

export default router; 