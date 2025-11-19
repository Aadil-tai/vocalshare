"use client";

import { useState, useRef } from "react";
import { Mic, Square, Upload, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have a button component or will create one
// If not, I'll use standard HTML button for now and style it with Tailwind

export default function Recorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob, duration: number) => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const duration = (Date.now() - startTimeRef.current) / 1000;
                onRecordingComplete(blob, duration);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            startTimeRef.current = Date.now();

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            setRecordingTime(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-xl bg-zinc-900 text-white">
            <div className="text-4xl font-mono font-bold text-emerald-400">
                {isRecording ? formatTime(recordingTime) : "0:00"}
            </div>

            <div className="flex gap-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full font-bold transition-all"
                    >
                        <Mic className="w-5 h-5" />
                        Record
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-full font-bold transition-all animate-pulse"
                    >
                        <Square className="w-5 h-5" />
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
}
