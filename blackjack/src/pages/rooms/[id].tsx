import { useParams } from "react-router";

export default function RoomPage() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Oda #{id}</h1>
                    <div className="flex gap-4">
                        <span className="text-gray-600"> Oyuncular: 2/4</span>
                        <button className="text-red-600 hover:text-red-700">Odadan Ayrıl</button>
                    </div>
                </div>
                
                {/* Oyun masası */}

                {/* Sohbet bölümü */}
                <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                    <h3 className="font-semibold mb-2">Sohbet</h3>
                    <div className="h-48 overflow-y-auto mb-2 border-t border-b">
                        {/* Sohbet mesajları buraya gelecek */}
                    </div>
                    <input 
                        type="text" 
                        placeholder="Mesajınızı yazın..."
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
} 