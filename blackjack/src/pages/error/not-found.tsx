import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center space-y-6 p-8">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-red-600">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-900">Sayfa Bulunamadı</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
                        Ana sayfaya dönerek devam edebilirsiniz.
                    </p>
                </div>
                
                <div className="flex justify-center gap-4">
                    <Button 
                        onClick={() => navigate("/")}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                    >
                        Ana Sayfaya Dön
                    </Button>
                    <Button 
                        onClick={() => navigate(-1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 border border-gray-200"
                    >
                        Geri Git
                    </Button>
                </div>

                {/* Decorative Elements */}
                <div className="relative mt-12">
                    <div className="text-gray-200 text-9xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 opacity-20">
                        404
                    </div>
                </div>
            </div>
        </div>
    );
}
