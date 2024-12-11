import { HttpException } from "../exceptions/http-exception.js";

const rooms = new Map(); // Odaları saklamak için Map kullanıyoruz

export const createRoom = (req, res) => {
    const { name, isPrivate, maxPlayers = 4 } = req.body;
    const user = req.user;

    const roomId = generateRoomId();
    const code = isPrivate ? generateRoomCode() : null;

    const room = {
        id: roomId,
        name,
        isPrivate,
        code,
        maxPlayers,
        players: [],
        createdBy: user.email,
        gameState: {
            status: 'waiting', // waiting, playing, finished
            deck: [],
            currentPlayer: null,
            dealer: {
                cards: [],
                total: 0
            }
        }
    };

    rooms.set(roomId, room);
    
    return res.status(201).json({ room });
};

export const joinRoom = (req, res) => {
    const { roomId, code } = req.body;
    const user = req.user;

    const room = rooms.get(roomId);
    if (!room) {
        throw new HttpException(404, "Oda bulunamadı");
    }

    if (room.isPrivate && room.code !== code) {
        throw new HttpException(403, "Geçersiz oda kodu");
    }

    if (room.players.length >= room.maxPlayers) {
        throw new HttpException(403, "Oda dolu");
    }

    if (!room.players.find(p => p.email === user.email)) {
        room.players.push({
            email: user.email,
            cards: [],
            total: 0,
            status: 'waiting' // waiting, playing, done
        });
    }

    return res.json({ room });
};

export const getRooms = (req, res) => {
    const publicRooms = Array.from(rooms.values())
        .filter(room => !room.isPrivate)
        .map(room => ({
            id: room.id,
            name: room.name,
            players: room.players.length,
            maxPlayers: room.maxPlayers,
            isPrivate: room.isPrivate
        }));

    return res.json({ rooms: publicRooms });
};

export const leaveRoom = (req, res) => {
    const { roomId } = req.params;
    const user = req.user;

    const room = rooms.get(roomId);
    if (!room) {
        throw new HttpException(404, "Oda bulunamadı");
    }

    room.players = room.players.filter(p => p.email !== user.email);

    if (room.players.length === 0) {
        rooms.delete(roomId);
    }

    return res.json({ message: "Odadan ayrıldınız" });
};

// Yardımcı fonksiyonlar
function generateRoomId() {
    return Math.random().toString(36).substr(2, 9);
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
} 