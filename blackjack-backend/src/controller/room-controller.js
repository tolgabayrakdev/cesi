import HttpException from '../exceptions/http-exception.js';
import RoomService from '../service/room-service.js'

export default class RoomController {
  constructor() {
    this.roomService = new RoomService();
  }

  async createRoom(req, res) {
    const host_user_id = req.user.id;
    try {
      const room = await this.roomService.createRoom(req.body, host_user_id);
      res.status(201).json({
        message: 'Oda oluşturuldu!',
        details: room,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async listRooms(_req, res) {
    try {
      const rooms = await this.roomService.listRooms();
      res.status(200).json(rooms);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  async joinRoom(req, res) {
    const roomId = req.params.roomId;
    const access_code = req.body.access_code;
    const userId = req.user.id;
    try {
      const rooms = await this.roomService.joinRoom(roomId, access_code, userId);
      res.status(200).json(rooms);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  async leaveRoom(req, res) {
    const roomId = req.params.roomId;
    const userId = req.user.id;
    try {
      const rooms = await this.roomService.leaveRoom(roomId, userId);
      res.status(200).json(rooms);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async showRoom(req, res) {
    const roomId = req.params.roomId;
    try {
      const room = await this.roomService.showRoom(roomId);
      res.status(200).json(room);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
