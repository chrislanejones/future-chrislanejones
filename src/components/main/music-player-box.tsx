"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";

type Track = {
  title: string;
  artist: string;
  album: string;
  src: string;
  artwork: string;
};

const tracks: Track[] = [
  {
    title: "Afterlife",
    artist: "Sharon Van Etten",
    album: "Sharon Van Etten & The Attachment Theory",
    artwork: "/music/art/Attachment-Theory.webp",
    src: "/music/audio/Sharon-Van-Etten-Afterlife.mp3",
  },
  {
    title: "Praise",
    artist: "Panda Bear",
    album: "Sinister Grift",
    artwork: "/music/art/Panda-Bear-Sinister-Grift.webp",
    src: "/music/audio/Panda-Bear-Praise.mp3",
  },
  {
    title: "After The Earthquake",
    artist: "Alvvays",
    album: "Blue Rev",
    artwork: "/music/art/Alvvays-Blue-Rev-Album-Art.webp",
    src: "/music/audio/alvvays-after-the-earthquake.mp3",
  },
];

export default function MusicPlayerBox() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <motion.div
      className="card rounded-3xl bg-panel col-span-1 md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[420px] border border-[color:var(--color-border)] border-opacity-30 shadow-passive overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <div className="image-container relative flex-1 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.artwork}
            src={currentTrack.artwork}
            alt={`${currentTrack.album} artwork`}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 bg-panel/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-sm transition-all hover:shadow-md">
            <Volume2 className="w-4 h-4 text-ink" />

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-2 bg-ink/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 shadow-passive focus-ring hover:shadow-glow bg-panel/95 backdrop-blur-sm border border-[color:var(--color-border)] text-foreground p-0 rounded-full h-11 w-11 shadow-sm transition hover:scale-105 active:scale-95"
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5 text-ink" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
        <h3 className="text-ink">
          {currentTrack.artist} – {currentTrack.title}
        </h3>

        <button
          onClick={handlePlayPause}
          className="inline-flex items-center justify-center gap-2 shadow-passive focus-ring hover:shadow-glow bg-panel border border-[color:var(--color-border)] text-foreground h-10 w-10 p-0 rounded-full shadow-sm transition hover:scale-105"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-ink" />
          ) : (
            <Play className="w-5 h-5 text-ink" />
          )}
        </button>
      </div>

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 5px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: var(--color-accent);
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--color-accent);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  );
}
