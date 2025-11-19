"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/components/Player";
import { Play, Clock, Share2 } from "lucide-react";

interface Song {
    id: string;
    title: string;
    url: string;
    duration: number;
    user: { name: string | null };
    createdAt: string;
}

export default function DashboardPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

    useEffect(() => {
        fetch("/api/songs")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSongs(data);
                }
            });
    }, []);

    const handlePlay = (song: Song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            playSong(song);
        }
    };

    return (
        <div className="min-h-screen bg-black p-8 pb-32">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Your Library
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Manage and listen to your recordings
                    </p>
                </header>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900 border-b border-zinc-800">
                            <tr>
                                <th className="p-4 w-16">#</th>
                                <th className="p-4">Title</th>
                                <th className="p-4 hidden md:table-cell">Date Added</th>
                                <th className="p-4 w-24"><Clock className="w-4 h-4" /></th>
                                <th className="p-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song, index) => (
                                <tr
                                    key={song.id}
                                    className="group hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0"
                                >
                                    <td className="p-4 text-zinc-500 font-mono">
                                        <button
                                            onClick={() => handlePlay(song)}
                                            className="w-8 h-8 flex items-center justify-center hover:text-emerald-400"
                                        >
                                            {currentSong?.id === song.id && isPlaying ? (
                                                <div className="flex gap-1 h-3 items-end">
                                                    <div className="w-1 bg-emerald-400 animate-[bounce_1s_infinite]" />
                                                    <div className="w-1 bg-emerald-400 animate-[bounce_1.2s_infinite]" />
                                                    <div className="w-1 bg-emerald-400 animate-[bounce_0.8s_infinite]" />
                                                </div>
                                            ) : (
                                                <span className="group-hover:hidden">{index + 1}</span>
                                            )}
                                            <Play className={`w-4 h-4 hidden group-hover:block ${currentSong?.id === song.id && isPlaying ? 'hidden' : ''}`} />
                                        </button>
                                    </td>
                                    <td className="p-4 font-medium text-white">
                                        {song.title}
                                        <div className="text-xs text-zinc-500 md:hidden">
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-400 hidden md:table-cell">
                                        {new Date(song.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-zinc-400 font-mono text-sm">
                                        {Math.floor(song.duration / 60)}:{(Math.floor(song.duration) % 60).toString().padStart(2, '0')}
                                    </td>
                                    <td className="p-4">
                                        <button className="p-2 text-zinc-400 hover:text-white transition-colors" title="Share">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {songs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                                        No songs found. Start by recording or uploading one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
