import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function RoomPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Oda #{id}</h1>
                        <span className="text-sm sm:text-base text-gray-600">
                            👥 Oyuncular: 2/4
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
                            onClick={() => navigate("/rooms")}
                            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                        >
                            Odadan Ayrıl
                        </Button>
                    </div>
                </div>
                
                {/* Oyun Alanı */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Oyun alanı burada olacak</p>
                    </div>
                </div>

                {/* Sohbet Bölümü */}
                <div className="fixed bottom-4 right-4 w-full sm:w-80 max-w-[calc(100%-2rem)] bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Sohbet</h3>
                    <div className="h-32 sm:h-48 overflow-y-auto mb-2 border-t border-b">
                        {/* Sohbet mesajları */}
                    </div>
                    <input 
                        type="text" 
                        placeholder="Mesajınızı yazın..."
                        className="w-full p-2 border rounded text-sm sm:text-base"
                    />
                </div>
            </div>
        </div>
    );
} 