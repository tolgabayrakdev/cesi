import express from 'express';
import RoomController from '../controller/room-controller';

const router = express.Router();

const roomController = new RoomController();

router.post('/', roomController.createRoom.bind(roomController));
router.get('/', roomController.listRooms.bind(roomController));

export default router;
