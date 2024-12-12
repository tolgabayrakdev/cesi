export default function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Odaya katılma
    socket.on('joinRoom', ({ roomId, user }) => {
      socket.join(roomId);
      socket.to(roomId).emit('userJoined', { user });
    });

    // Odadan ayrılma
    socket.on('leaveRoom', ({ roomId, user }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('userLeft', { user });
    });

    // Oyun aksiyonları
    socket.on('drawCard', ({ roomId, user }) => {
      // Kart çekme mantığı
      const card = drawCardFromDeck();
      io.to(roomId).emit('cardDrawn', { user, card });
    });

    socket.on('stand', ({ roomId, user }) => {
      // Dur deme mantığı
      io.to(roomId).emit('playerStood', { user });
    });

    // Sohbet
    socket.on('sendMessage', ({ roomId, user, message }) => {
      io.to(roomId).emit('newMessage', { user, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

function drawCardFromDeck() {
  // Kart çekme mantığı burada olacak
  const suits = ['♠', '♣', '♥', '♦'];
  const values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return value + suit;
}
