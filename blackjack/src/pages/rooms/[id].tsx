import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface Player {
    id: number;
    name: string;
    cards: string[];
    total: number;
    isActive?: boolean;
}

interface Room {
    room_id: number;
    room_name: string;
    host_user_id: number;
    max_players: number;
    bet_amount: string;
    is_private: boolean;
    access_code?: string;
    current_players: number;
    users: string[];
}

// Boş oyuncu şablonu oluşturan yardımcı fonksiyon
const createEmptyPlayer = (position: number) => ({
    id: position,
    name: "Boş",
    cards: [],
    total: 0,
    isActive: false
});

// Oyuncuları masaya yerleştiren fonksiyon
const arrangePlayersOnTable = (users: string[]) => {
    const players: Player[] = Array(4).fill(null).map((_, i) => createEmptyPlayer(i + 1));
    
    users.forEach((username, index) => {
        if (index < 4) { // Maximum 4 oyuncu
            players[index] = {
                id: index + 1,
                name: username,
                cards: [], // Şimdilik boş kartlar
                total: 0,  // Şimdilik 0 toplam
                isActive: false // Şimdilik aktif değil
            };
        }
    });

    return players;
};

export default function RoomPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);

    // Oda bilgilerini çek
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`http://localhost:1234/api/rooms/${id}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Bu oda mevcut değil');
                    }
                    throw new Error('Oda bilgileri yüklenirken bir hata oluştu');
                }

                const data = await response.json();
                // API'den gelen kullanıcıları masaya yerleştir
                const arrangedPlayers = arrangePlayersOnTable(data.users);
                setRoom({
                    ...data,
                    players: arrangedPlayers
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Bir hata oluştu');
                console.error('Oda bilgileri yüklenirken hata:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoom();
        // Her 5 saniyede bir oda bilgilerini güncelle
        const interval = setInterval(fetchRoom, 5000);
        return () => clearInterval(interval);
    }, [id]);

    // leaveRoom fonksiyonunu ekleyelim
    const leaveRoom = async () => {
        setIsLeaving(true);
        try {
            const response = await fetch(`http://localhost:1234/api/rooms/${id}/leave`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Odadan ayrılırken bir hata oluştu');
            }

            navigate('/rooms');
        } catch (error) {
            console.error('Odadan ayrılma hatası:', error);
            alert(error instanceof Error ? error.message : 'Odadan ayrılırken bir hata oluştu');
        } finally {
            setIsLeaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center">
                <p className="text-gray-600">Oda yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <h2 className="text-red-800 text-lg font-semibold mb-2">Hata</h2>
                        <p className="text-red-600">{error}</p>
                        <Button 
                            onClick={() => navigate("/rooms")}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                        >
                            Lobiye Dön
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <h2 className="text-yellow-800 text-lg font-semibold mb-2">Oda Bulunamadı</h2>
                        <p className="text-yellow-600">Aradığınız oda mevcut değil.</p>
                        <Button 
                            onClick={() => navigate("/rooms")}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                        >
                            Lobiye Dön
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const PlayerCard = ({ player }: { player: Player }) => (
        <div className={`flex flex-col items-center ${player.isActive ? 'ring-2 ring-red-500 ring-offset-2' : ''} 
            rounded-lg p-2 ${player.cards.length ? 'bg-white' : 'bg-gray-50'}`}>
            <h3 className="font-bold text-sm">{player.name}</h3>
            {player.cards.length > 0 ? (
                <>
                    <div className="flex gap-1 my-1">
                        {player.cards.map((card, index) => (
                            <div key={index} className="w-10 h-16 bg-white border border-gray-300 rounded-md flex items-center justify-center">
                                <span className="text-sm">{card}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-sm">Toplam: {player.total}</div>
                </>
            ) : (
                <div className="w-10 h-16 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">Boş</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{room.room_name}</h1>
                        <span className="text-sm sm:text-base text-gray-600">
                            👥 Oyuncular: {room.current_players}/{room.max_players}
                        </span>
                        <span className="text-sm sm:text-base text-gray-600">
                            💰 Bahis: {parseInt(room.bet_amount).toLocaleString('tr-TR')} ₺
                        </span>
                    </div>
                    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                        <Button
                            onClick={() => navigate("/rooms")}
                            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm sm:text-base"
                        >
                            Lobiye Dön
                        </Button>
                        <Button
                            onClick={leaveRoom}
                            disabled={isLeaving}
                            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                        >
                            {isLeaving ? 'Ayrılıyor...' : 'Odadan Ayrıl'}
                        </Button>
                    </div>
                </div>

                {/* Oyun Masası */}
                <div className="bg-gray-100 rounded-xl border border-gray-200 shadow-lg min-h-[600px]">
                    <div className="p-8 h-[600px]">
                        <div className="h-full flex flex-col items-center justify-between">
                            {/* Krupiye */}
                            <div className="flex flex-col items-center mb-8">
                                <h3 className="font-bold text-lg mb-2">Krupiye</h3>
                                <div className="w-16 h-24 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                                    <span className="text-gray-400">Bekliyor</span>
                                </div>
                            </div>

                            {/* Oyuncular */}
                            <div className="w-full max-w-5xl mt-auto">
                                <div className="grid grid-cols-4 gap-4 lg:gap-8">
                                    {room.players?.map((player) => (
                                        <PlayerCard key={player.id} player={player} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Oyun Kontrolleri */}
                <div className="flex justify-center gap-4 mt-4 relative z-30">
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8">
                        Kart Çek
                    </Button>
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8">
                        Dur
                    </Button>
                </div>

                {/* Sohbet Bölümü */}
                <div className={`fixed transition-all duration-300 ease-in-out z-20 
                    ${isChatExpanded
                        ? 'bottom-0 right-0 left-0 h-[50vh] sm:left-auto sm:right-4 sm:w-80 sm:h-[300px] sm:bottom-20 rounded-t-xl sm:rounded-lg'
                        : 'bottom-4 right-4 h-12 w-12 rounded-full'
                    } bg-white shadow-lg border border-gray-200 flex flex-col`}
                >
                    {/* Sohbet Başlığı ve Toggle Butonu */}
                    <div
                        className={`flex justify-between items-center cursor-pointer border-b shrink-0 bg-white
                            ${isChatExpanded
                                ? 'p-3 rounded-t-xl sm:rounded-t-lg'
                                : 'p-0 h-full rounded-full'
                            }`}
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                    >
                        <h3 className={`font-semibold text-sm sm:text-base
                            ${isChatExpanded ? 'block' : 'hidden'}`}
                        >
                            Sohbet
                        </h3>
                        <div className={`flex items-center gap-2 
                            ${isChatExpanded ? '' : 'w-full h-full justify-center'}`}
                        >
                            <span className={`text-sm text-gray-500 ${isChatExpanded ? 'block' : 'hidden'}`}>
                                {isChatExpanded ? 'Küçült' : 'Büyüt'}
                            </span>
                            <button className={`text-gray-500 hover:text-gray-700 
                                ${isChatExpanded ? '' : 'w-full h-full flex items-center justify-center'}`}
                            >
                                {isChatExpanded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 11-1.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sohbet İçeriği */}
                    {isChatExpanded && (
                        <div className="flex flex-col flex-1 p-3">
                            <div className="flex-1 overflow-y-auto mb-3 border-t border-b">
                                {/* Sohbet mesajları */}
                            </div>
                            <div className="shrink-0 relative">
                                <input
                                    type="text"
                                    placeholder="Mesajınızı yazın..."
                                    className="w-full p-2 pr-10 border rounded text-sm sm:text-base"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
