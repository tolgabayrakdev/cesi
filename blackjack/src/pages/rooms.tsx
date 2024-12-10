import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Room {
    id: string;
    name: string;
    players: number;
    maxPlayers: number;
    isPrivate: boolean;
}

export default function Rooms() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([
        // Örnek odalar
        { id: '1', name: 'Arkadaş Masası', players: 2, maxPlayers: 4, isPrivate: false },
        { id: '2', name: 'VIP Masa', players: 1, maxPlayers: 4, isPrivate: true },
    ]);

    const createRoom = () => {
        // Yeni oda oluşturma işlemleri
        const newRoom = {
            id: String(rooms.length + 1),
            name: `Oda ${rooms.length + 1}`,
            players: 1,
            maxPlayers: 4,
            isPrivate: false
        };
        setRooms([...rooms, newRoom]);
        navigate(`/rooms/${newRoom.id}`);
    };

    const joinRoom = (roomId: string) => {
        // Odaya katılma işlemleri
        navigate(`/rooms/${roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Oyun Odaları</h1>
                    <Button 
                        onClick={createRoom}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Yeni Oda Oluştur
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                                    <p className="text-gray-600">
                                        {room.players}/{room.maxPlayers} Oyuncu
                                    </p>
                                </div>
                                {room.isPrivate && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                                        🔒 Özel
                                    </span>
                                )}
                            </div>
                            <Button 
                                onClick={() => joinRoom(room.id)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                                disabled={room.players >= room.maxPlayers}
                            >
                                {room.players >= room.maxPlayers ? 'Oda Dolu' : 'Odaya Katıl'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 