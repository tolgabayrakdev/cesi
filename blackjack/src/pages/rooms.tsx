import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
    id: number;
    name: string;
    current_players: number;
    max_players: number;
    is_private: boolean;
    bet_amount: string;
    status: string;
    code?: string;
}

interface User {
    email: string;
    username?: string;
}

export default function Rooms() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
    const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [newRoomCode, setNewRoomCode] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [joiningRoom, setJoiningRoom] = useState<number | null>(null);

    // Kullanıcı bilgisini al
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch('http://localhost:1234/api/auth/verify', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    // Doğrulama başarısız, login sayfasına yönlendir
                    navigate('/');
                    return;
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Doğrulama hatası:', error);
                navigate('/');
            }
        };

        verifyUser();
    }, [navigate]);

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
            current_players: 1,
            max_players: 4,
            is_private: isPrivate,
            bet_amount: "0",
            status: "waiting",
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

    const joinRoom = async (roomId: number, accessCode?: string) => {
        setJoiningRoom(roomId);
        try {
            const response = await fetch(`http://localhost:1234/api/rooms/${roomId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ access_code: accessCode }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Odaya katılırken bir hata oluştu');
            }

            navigate(`/rooms/${roomId}`);
        } catch (error) {
            console.error('Odaya katılma hatası:', error);
            alert(error instanceof Error ? error.message : 'Odaya katılırken bir hata oluştu');
        } finally {
            setJoiningRoom(null);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:1234/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Çıkış yapılırken bir hata oluştu');
            }

            navigate("/");
        } catch (error) {
            console.error('Çıkış hatası:', error);
            alert('Çıkış yapılırken bir hata oluştu');
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch('http://localhost:1234/api/rooms', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Odalar yüklenirken bir hata oluştu');
            }

            const data = await response.json();
            setRooms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
            console.error('Odalar yüklenirken hata:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Odaları yüklemek için useEffect ekliyoruz
    useEffect(() => {
        fetchRooms();
        // Odaları her 10 saniyede bir güncelle
        const interval = setInterval(fetchRooms, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Oyun Odaları</h1>
                        {user && (
                            <span className="text-sm sm:text-base text-gray-600">
                                ( {user.email} )
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                        <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base">
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

                        <Button 
                            onClick={handleLogout} 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 text-sm sm:text-base"
                        >
                            Çıkış Yap
                        </Button>
                    </div>
                </div>

                {/* Odalar Listesi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-600">Odalar yükleniyor...</p>
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-600">Henüz hiç oda oluşturulmamış.</p>
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{room.name}</h3>
                                        <div className="space-y-1">
                                            <p className="text-sm sm:text-base text-gray-600">
                                                {room.current_players}/{room.max_players} Oyuncu
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Bahis: {parseInt(room.bet_amount).toLocaleString('tr-TR')} ₺
                                            </p>
                                            <div className="flex gap-2">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                    room.is_private 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {room.is_private ? 'Özel Oda' : 'Herkese Açık'}
                                                </span>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                    room.status === 'waiting' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {room.status === 'waiting' ? 'Bekliyor' : 'Oyunda'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {room.is_private ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button 
                                                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                                                disabled={room.current_players >= room.max_players || room.status !== 'waiting'}
                                            >
                                                {room.current_players >= room.max_players 
                                                    ? 'Oda Dolu' 
                                                    : room.status !== 'waiting'
                                                        ? 'Oyun Başladı'
                                                        : 'Odaya Katıl'}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Özel Odaya Katıl</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                await joinRoom(room.id, roomCode);
                                            }} className="space-y-4">
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
                                ) : (
                                    <Button 
                                        onClick={() => joinRoom(room.id)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                                        disabled={room.current_players >= room.max_players || 
                                                  room.status !== 'waiting' || 
                                                  joiningRoom === room.id}
                                    >
                                        {joiningRoom === room.id 
                                            ? 'Katılınıyor...' 
                                            : room.current_players >= room.max_players 
                                                ? 'Oda Dolu' 
                                                : room.status !== 'waiting'
                                                    ? 'Oyun Başladı'
                                                    : 'Odaya Katıl'}
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
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