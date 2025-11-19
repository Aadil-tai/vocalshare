import Link from "next/link";
import { Music, Mic, Share2, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm mb-4 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-zinc-300">The Future of Music Sharing</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent animate-fade-in-up delay-100">
            Record. Share. <br />
            <span className="text-emerald-400">Inspire.</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto animate-fade-in-up delay-200">
            The easiest way to capture your musical ideas and share them with the world.
            High-quality audio recording, instant sharing, and a community of creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/register"
              className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
            >
              Start Creating
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg border border-zinc-800 transition-all hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-emerald-400" />}
              title="Studio Quality Recording"
              description="Capture your vocals and instruments with crystal clear quality directly from your browser."
            />
            <FeatureCard
              icon={<Share2 className="w-8 h-8 text-purple-400" />}
              title="Instant Sharing"
              description="Share your tracks with a single link. Collaborate with friends or build your fanbase."
            />
            <FeatureCard
              icon={<PlayCircle className="w-8 h-8 text-cyan-400" />}
              title="Seamless Playback"
              description="Listen to your library anywhere, anytime. Create playlists and organize your music."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-500">
        <p>&copy; 2024 SoundShare. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1 group">
      <div className="mb-6 p-4 rounded-2xl bg-black border border-zinc-800 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
