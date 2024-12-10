"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Welcome() {
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate("/rooms");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="h-screen flex flex-col items-center justify-center relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/cards-pattern.png')] opacity-10"></div>

                {/* Main Content */}
                <div className="z-10 text-center space-y-8 px-4">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                        <span className="text-red-600">Black</span>Jack
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Arkadaşlarınla online blackjack oynamanın en eğlenceli yolu! 
                        Özel odalarda buluş, sohbet et ve kazanmanın keyfini çıkar.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 Arkadaşlarınla Oyna</h3>
                            <p className="text-gray-600">Özel odalarda arkadaşlarınla buluş ve eğlenceyi ikiye katla</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎮 Eğlenceli Deneyim</h3>
                            <p className="text-gray-600">Sohbet özelliği ve emoji reaksiyonlarıyla eğlence tam gaz</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎁 Günlük Hediyeler</h3>
                            <p className="text-gray-600">Her gün giriş yap, bedava çipler kazan ve oyuna devam et</p>
                        </div>
                    </div>

                    {/* Özel Tanıtım Kartı */}
                    <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-xl border border-red-100 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-red-600 mb-2">🌟 Yeni Özellik!</h3>
                        <p className="text-gray-700">
                            Artık özel odalarda 4 kişiye kadar arkadaşınla oynayabilirsin. 
                            Hemen kayıt ol ve eğlenceye katıl!
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 justify-center mt-8">
                        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                                    Giriş Yap
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle className="text-gray-900">Giriş Yap</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleLogin} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                                        <Input id="email" type="email" placeholder="ornek@email.com" className="border-gray-200" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-gray-700">Şifre</Label>
                                        <Input id="password" type="password" placeholder="********" className="border-gray-200" />
                                    </div>
                                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Giriş Yap</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                        
                        <Button onClick={() => navigate("/play")} className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                            Demo Oyna
                        </Button>

                        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-6 text-lg border border-gray-200">
                                    Kayıt Ol
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle className="text-gray-900">Kayıt Ol</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username" className="text-gray-700">Kullanıcı Adı</Label>
                                        <Input id="username" type="text" placeholder="kullaniciadi" className="border-gray-200" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="register-email" className="text-gray-700">Email</Label>
                                        <Input id="register-email" type="email" placeholder="ornek@email.com" className="border-gray-200" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="register-password" className="text-gray-700">Şifre</Label>
                                        <Input id="register-password" type="password" placeholder="********" className="border-gray-200" />
                                    </div>
                                    <Button className="w-full bg-red-600 hover:bg-red-700">Kayıt Ol</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}