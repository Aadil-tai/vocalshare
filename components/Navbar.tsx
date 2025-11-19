"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Music, LogOut, Upload, User } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                            <Music className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">SoundShare</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <Link
                                    href="/upload"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload</span>
                                </Link>

                                <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                                            {session.user?.name?.[0] || "U"}
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-zinc-300">
                                            {session.user?.name}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-zinc-400 hover:text-white transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
