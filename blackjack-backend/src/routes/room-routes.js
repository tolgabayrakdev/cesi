import express from 'express';
import RoomController from '../controller/room-controller.js';
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const roomController = new RoomController();

router.post('/', verifyToken, roomController.createRoom.bind(roomController));
router.get('/', verifyToken, roomController.listRooms.bind(roomController));

export default router;
