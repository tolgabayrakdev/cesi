import pool from '../config/database.js';
import HttpException from '../exceptions/http-exception.js';
import { io } from '../socket.js';

export default class RoomService {


  async createRoom(data, host_user_id) {
    const client = await pool.connect();
    try {
      // Odanın oluşturulması için gerekli veriler
      const accessCode = data.is_private ? Math.floor(Math.random() * 900000 + 100000) : null;

      // Oda oluşturuluyor
      const newRoom = await client.query(
        'INSERT INTO rooms (name, host_user_id, max_players, bet_amount, is_private, access_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, access_code',
        [
          data.name,
          host_user_id,
          data.max_players,
          data.bet_amount,
          data.is_private,
          accessCode
        ]
      );

      const roomId = newRoom.rows[0].id;

      // Odayı oluşturan kullanıcıyı room_players tablosuna ekliyoruz
      await client.query(
        'INSERT INTO room_players (room_id, user_id) VALUES ($1, $2)',
        [roomId, host_user_id]
      );

      // Odanın current_players değerini 1 artırıyoruz (Çünkü host kullanıcı odaya katıldı)
      await client.query(
        'UPDATE rooms SET current_players = current_players + 1 WHERE id = $1',
        [roomId]
      );

      return {
        id: roomId,
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
        'SELECT * FROM rooms',
      );
      return rooms.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
  async joinRoom(roomId, access_code, userId, socket) {
    const client = await pool.connect();
    try {
      // 1. Kullanıcının Başka Bir Odada Olup Olmadığını Kontrol Et
      const existingRoom = await client.query(
        'SELECT room_id FROM room_players WHERE user_id = $1',
        [userId]
      );
  
      if (existingRoom.rows.length > 0) {
        const existingRoomId = existingRoom.rows[0].room_id;
  
        // Kullanıcı Mevcut Odadan Çıkarılır
        await client.query(
          'DELETE FROM room_players WHERE user_id = $1 AND room_id = $2',
          [userId, existingRoomId]
        );
  
        // Odanın current_players Değeri Güncellenir
        await client.query(
          'UPDATE rooms SET current_players = current_players - 1 WHERE id = $1',
          [existingRoomId]
        );
  
        // Socket üzerinden mevcut odadan çıkarma işlemi
        socket.leave(existingRoomId);
        io.to(existingRoomId).emit('userLeft', { userId });
      }
  
      // 2. Yeni Odaya Katılma İşlemi
      const room = await client.query(
        'SELECT is_private, access_code, current_players, max_players FROM rooms WHERE id = $1',
        [roomId]
      );
  
      if (!room.rows.length) {
        throw new HttpException(404, 'Room not found');
      }
  
      const { is_private, access_code: dbAccessCode, current_players, max_players } = room.rows[0];
  
      if (is_private && dbAccessCode !== access_code) {
        throw new HttpException(403, 'Invalid access code');
      }
  
      if (current_players >= max_players) {
        throw new HttpException(403, 'Room is full');
      }
  
      await client.query(
        'INSERT INTO room_players (room_id, user_id) VALUES ($1, $2)',
        [roomId, userId]
      );
  
      await client.query(
        'UPDATE rooms SET current_players = current_players + 1 WHERE id = $1',
        [roomId]
      );
  
      // Kullanıcıyı socket üzerinden odaya dahil etme
      socket.join(roomId);
      io.to(roomId).emit('userJoined', { userId });
  
      return { message: 'Room joined successfully' };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }


  async leaveRoom(roomId, userId, socket) {
    const client = await pool.connect();
    try {
      // 1. Kullanıcıyı Odanın Veritabanından Silme
      await client.query(
        'DELETE FROM room_players WHERE room_id = $1 AND user_id = $2',
        [roomId, userId]
      );
  
      // 2. Odanın current_players Değerini Güncelleme
      await client.query(
        'UPDATE rooms SET current_players = current_players - 1 WHERE id = $1',
        [roomId]
      );
  
      // 3. Socket üzerinden kullanıcıyı odadan çıkarma
      socket.leave(roomId);
      io.to(roomId).emit('userLeft', { userId });
  
      return { message: 'Room left successfully' };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
  

  async showRoom(roomId) {
    const client = await pool.connect();
    try {
      // Oda bilgilerini ve odadaki kullanıcı bilgilerini alıyoruz
      const room = await client.query(
        `
        SELECT r.id AS room_id, r.name AS room_name, r.host_user_id, r.max_players, r.bet_amount, r.is_private, r.access_code, r.current_players, u.username
        FROM rooms r
        LEFT JOIN room_players rp ON r.id = rp.room_id
        LEFT JOIN users u ON rp.user_id = u.id
        WHERE r.id = $1
        `,
        [roomId]
      );

      if (!room.rows.length) {
        throw new HttpException(404, 'Room not found');
      }

      // Odaya ait bilgileri ve kullanıcıları döndürüyoruz
      const roomData = {
        room_id: room.rows[0].room_id,
        room_name: room.rows[0].room_name,
        host_user_id: room.rows[0].host_user_id,
        max_players: room.rows[0].max_players,
        bet_amount: room.rows[0].bet_amount,
        is_private: room.rows[0].is_private,
        access_code: room.rows[0].access_code,
        current_players: room.rows[0].current_players,
        users: room.rows.map(row => row.username).filter(username => username)  // Filtreleme, sadece kullanıcı adı olanları döndürür
      };

      return roomData;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

}
