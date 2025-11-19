"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Recorder from "@/components/Recorder";
import { Upload as UploadIcon, Music } from "lucide-react";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRecordingComplete = (blob: Blob, duration: number) => {
        const recordedFile = new File([blob], `recording-${Date.now()}.webm`, {
            type: "audio/webm",
        });
        setFile(recordedFile);
        // We might want to store duration somewhere if we want to send it to backend
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title || file.name);
        // formData.append("duration", duration.toString()); // If we had duration

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Create Music
                    </h1>
                    <p className="text-zinc-400 mt-2">Record or upload your masterpiece</p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400">
                            Record Audio
                        </label>
                        <Recorder onRecordingComplete={handleRecordingComplete} />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-900 px-2 text-zinc-500">Or upload file</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                                Song Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Awesome Song"
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                                Audio File
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-zinc-800 rounded-lg hover:border-emerald-500 hover:bg-zinc-800/50 cursor-pointer transition-all"
                                >
                                    <UploadIcon className="w-5 h-5 text-zinc-400" />
                                    <span className="text-zinc-400">
                                        {file ? file.name : "Choose audio file"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Uploading..." : "Save Song"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
