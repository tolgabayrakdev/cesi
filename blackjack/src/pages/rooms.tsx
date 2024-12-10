import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Room {
    id: string;
    name: string;
    players: number;
    maxPlayers: number;
    isPrivate: boolean;
    code?: string;
}

export default function Rooms() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([
        { id: '1', name: 'Arkadaş Masası', players: 2, maxPlayers: 4, isPrivate: false },
        { id: '2', name: 'VIP Masa', players: 1, maxPlayers: 4, isPrivate: true, code: "ABC123" },
    ]);
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
    const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [newRoomCode, setNewRoomCode] = useState<string | null>(null);

    // 6 haneli rastgele kod oluşturma
    const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Kod kopyalandı!');
        } catch (err) {
            console.error('Kod kopyalanamadı:', err);
        }
    };

    const createRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const roomName = formData.get('roomName') as string;
        const isPrivate = formData.get('isPrivate') === 'true';

        const code = isPrivate ? generateRoomCode() : undefined;
        const newRoom = {
            id: String(rooms.length + 1),
            name: roomName,
            players: 1,
            maxPlayers: 4,
            isPrivate: isPrivate,
            code: code
        };

        setRooms([...rooms, newRoom]);
        setIsCreateRoomOpen(false);

        if (isPrivate && code) {
            setNewRoomCode(code);
        } else {
            navigate(`/rooms/${newRoom.id}`);
        }
    };

    const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const room = rooms.find(r => r.code === roomCode);
        if (room) {
            setIsJoinRoomOpen(false);
            navigate(`/rooms/${room.id}`);
        } else {
            alert('Geçersiz oda kodu!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Oyun Odaları</h1>
                    <div className="flex gap-4">
                        <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-red-600 hover:bg-red-700 text-white">
                                    Yeni Oda Oluştur
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yeni Oda Oluştur</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={createRoom} className="space-y-4">
                                    <div>
                                        <Label htmlFor="roomName">Oda Adı</Label>
                                        <Input id="roomName" name="roomName" placeholder="Oda adını girin" required />
                                    </div>
                                    <div>
                                        <Label>Oda Türü</Label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="isPrivate" value="false" defaultChecked />
                                                <span>Herkese Açık</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="isPrivate" value="true" />
                                                <span>Özel Oda</span>
                                            </label>
                                        </div>
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Oda Oluştur
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isJoinRoomOpen} onOpenChange={setIsJoinRoomOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200">
                                    Odaya Katıl
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Odaya Katıl</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={joinRoom} className="space-y-4">
                                    <div>
                                        <Label htmlFor="roomCode">Oda Kodu</Label>
                                        <Input 
                                            id="roomCode" 
                                            value={roomCode}
                                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                            placeholder="Örn: ABC123"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Katıl
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button 
                            onClick={() => navigate("/")} 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                        >
                            Çıkış Yap
                        </Button>
                    </div>
                </div>

                {/* Odalar Listesi */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.filter(room => !room.isPrivate).map((room) => (
                        <div key={room.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                                    <p className="text-gray-600">
                                        {room.players}/{room.maxPlayers} Oyuncu
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => navigate(`/rooms/${room.id}`)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                                disabled={room.players >= room.maxPlayers}
                            >
                                {room.players >= room.maxPlayers ? 'Oda Dolu' : 'Odaya Katıl'}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Oda Kodu Alert Dialog */}
                <AlertDialog open={!!newRoomCode} onOpenChange={(open) => {
                    if (!open) {
                        navigate(`/rooms/${rooms[rooms.length - 1].id}`);
                        setNewRoomCode(null);
                    }
                }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Oda Başarıyla Oluşturuldu!</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-4">
                                <p className="text-center text-gray-600">
                                    Arkadaşlarınızla paylaşabileceğiniz oda kodu:
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <code className="bg-gray-100 px-4 py-2 rounded-lg text-2xl font-mono">
                                        {newRoomCode}
                                    </code>
                                    <Button
                                        onClick={() => newRoomCode && copyToClipboard(newRoomCode)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Kopyala
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500 text-center">
                                    Bu kodu arkadaşlarınızla paylaşın. Onlar "Odaya Katıl" butonunu kullanarak 
                                    bu kod ile odaya katılabilirler.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button
                                onClick={() => {
                                    navigate(`/rooms/${rooms[rooms.length - 1].id}`);
                                    setNewRoomCode(null);
                                }}
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                                Odaya Git
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
} 