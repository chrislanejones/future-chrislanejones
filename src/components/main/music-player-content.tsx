"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/page/card";

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

export default function MusicPlayerContent() {
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
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Media section */}
      <div className="relative flex-1">
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

        <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent" />

        {/* Volume control */}
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
              className="volume-slider w-16 h-2 bg-ink/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Skip button */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <Button
            onClick={handleNext}
            variant="neutral"
            size="icon"
            round
            className="bg-panel/95 backdrop-blur-sm"
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5 text-ink" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <CardFooter className="grid grid-cols-[1fr_auto] items-center gap-4">
        <p className="text-ink tracking-tight">
          {currentTrack.artist} — {currentTrack.title}
        </p>
        <Button
          onClick={handlePlayPause}
          variant="neutral"
          size="icon"
          round
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-ink" />
          ) : (
            <Play className="w-5 h-5 text-ink" />
          )}
        </Button>
      </CardFooter>

      <style>{`
        .volume-slider {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 5px;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: var(--color-accent);
          border-radius: 50%;
          cursor: pointer;
        }
        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--color-accent);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
}
