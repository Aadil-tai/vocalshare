"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

// Simple global state for audio player (in a real app, use Context or Zustand)
// For this MVP, we'll just expose a way to set the current song via a custom event or similar, 
// but for better React practice, let's make a Context. 
// Actually, to keep it simple and fast, I'll create a Context in this file.

import { createContext, useContext } from "react";

interface Song {
    id: string;
    title: string;
    url: string;
    duration: number;
    user: { name: string | null };
}

interface PlayerContextType {
    currentSong: Song | null;
    playSong: (song: Song) => void;
    isPlaying: boolean;
    togglePlay: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
    return context;
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playSong = (song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <PlayerContext.Provider value={{ currentSong, playSong, isPlaying, togglePlay }}>
            {children}
            {currentSong && <FixedPlayer song={currentSong} isPlaying={isPlaying} onToggle={togglePlay} />}
        </PlayerContext.Provider>
    );
}

function FixedPlayer({ song, isPlaying, onToggle }: { song: Song; isPlaying: boolean; onToggle: () => void }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, song]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration || 1;
            setProgress((current / duration) * 100);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 p-4 z-50">
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => onToggle()}
            />

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-1/3">
                    <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="font-bold truncate">{song.title}</h4>
                        <p className="text-xs text-zinc-400 truncate">{song.user.name || "Unknown Artist"}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-6">
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onToggle}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                        </button>
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <SkipForward className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="w-1/3 flex justify-end">
                    {/* Volume control could go here */}
                </div>
            </div>
        </div>
    );
}
