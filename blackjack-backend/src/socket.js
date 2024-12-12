// socket.js
import { Server } from 'socket.io';

export let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', ({ roomId, user }) => {
      socket.join(roomId);
      socket.to(roomId).emit('userJoined', { user });
    });

    socket.on('leaveRoom', ({ roomId, user }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('userLeft', { user });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
