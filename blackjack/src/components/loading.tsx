export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col gap-4 justify-center items-center bg-gradient-to-b from-white via-gray-50 to-gray-100">
            {/* Animasyonlu kart simgesi */}
            <div className="relative w-12 h-12 animate-spin">
                <div className="absolute inset-0 rounded-lg border-4 border-gray-200 border-t-red-600"></div>
            </div>
            
            {/* Yükleniyor yazısı */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-semibold text-gray-900">Yükleniyor</p>
                <p className="text-gray-600 text-sm animate-pulse">Lütfen bekleyiniz...</p>
            </div>
        </div>
    );
}
