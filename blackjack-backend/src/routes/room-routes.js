import express from 'express';
import RoomController from '../controller/room-controller.js';
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const roomController = new RoomController();

router.post('/', verifyToken, roomController.createRoom.bind(roomController));
router.get('/', verifyToken, roomController.listRooms.bind(roomController));
router.get('/:roomId', verifyToken, roomController.showRoom.bind(roomController));
router.post('/:roomId/join', verifyToken, roomController.joinRoom.bind(roomController));
router.post('/:roomId/leave', verifyToken, roomController.leaveRoom.bind(roomController));

export default router;
