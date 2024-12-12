import pool from '../config/database.js';
import HttpException from '../exceptions/http-exception.js';

export default class RoomService {
  constructor() { }

  async createRoom(data, host_user_id) {
    const client = await pool.connect();
    try {
      const accessCode = data.is_private ? Math.floor(Math.random() * 900000 + 100000) : null;
      const newRoom = await client.query(
        'INSERT INTO rooms (name, host_user_id, max_players, bet_amount, is_private, access_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, access_code',
        [
          data.name,
          host_user_id,
          data.max_players,
          data.bet_amount,
          data.is_private,
          accessCode
        ],
      );
      return {
        id: newRoom.rows[0].id,
        access_code: newRoom.rows[0].access_code,
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async listRooms() {
    const client = await pool.connect();
    try {
      const rooms = await client.query(
        'SELECT * FROM rooms WHERE is_private = false',
      );
      return rooms.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async joinRoom(roomId, access_code, userId) {
    const client = await pool.connect();
    try {
      const room = await client.query(
        'SELECT is_private, access_code, current_players, max_players FROM rooms WHERE id = $1',
        [roomId],
      )
      if (!room.rows.length) {
        throw new HttpException(404, 'Room not found');
      }
      const { is_private, access_code, current_players, max_players } = room.rows[0];

      if (is_private && access_code !== access_code) {
        throw new HttpException(403, 'Invalid access code');
      }

      if (current_players >= max_players) {
        throw new HttpException(403, 'Room is full');
      }

      await client.query(
        `
          INSERT INTO room_players (room_id, user_id)
          VALUES ($1, $2)
        `, [roomId, userId]
      )

      await client.query(
        `
        UPDATE rooms
        SET current_players = current_players + 1
        WHERE id = $1
        `, [roomId]
      )
      return { message: 'Room joined successfully' };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}
