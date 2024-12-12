import HttpException from '../exceptions/http-exception.js';
import RoomService from '../service/room-service.js';

export default class RoomController {
  constructor() {
    this.roomService = new RoomService();
  }

  async createRoom(_req, res) {
    try {
      res.status(201).json({ message: 'Oda oluşturuldu!' });
    } catch (error) {
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
}
