import pool from '../config/database.js';
import HttpException from '../exceptions/http-exception.js';

export class RoomService {
  constructor() { }

  async createRoom(data) {
    const client = await pool.connect();
    try {
      const newRoom = await client.query(
        'INSERT INTO rooms (name, host_user_id, max_players, is_private, code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [data.name, data.players, data.max_players, data.is_private, data.code],
      );
      return newRoom.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async listRooms() {
    const client = await pool.connect();
    try {
      const rooms = await client.query('SELECT * FROM rooms');
      return rooms.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}
