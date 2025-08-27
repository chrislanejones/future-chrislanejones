"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SkipBack, Play, Pause, SkipForward, Volume2 } from "lucide-react";

// Music playlist - add your audio files to the public folder
const playlist = [
  {
    title: "After The Earthquake",
    artist: "Alvvays",
    album: "Blue Rev",
    albumArt: "/music/art/Alvvays-Blue-Rev-Album-Art.webp",
    audioSrc: "/music/audio/after-the-earthquake.mp3", // Add your audio file here
  },
  //   // Add more tracks as needed
  //   {
  //     title: "Sample Track 2",
  //     artist: "Artist Name",
  //     album: "Album Name",
  //     albumArt: "/Alvvays-Blue-Rev-Album-Art.webp", // Placeholder
  //     audioSrc: "/music/track2.mp3",
  //   },
];

export default function MusicPlayerBox() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentTrackIndex, volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(false);
  };

  const previousTrack = () => {
    setCurrentTrackIndex(
      (prev) => (prev - 1 + playlist.length) % playlist.length
    );
    setIsPlaying(false);
  };

  return (
    <motion.article
      className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="relative flex-1 min-h-[200px]">
        <Image
          src={currentTrack.albumArt}
          alt="album art"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent"></div>

        {/* Volume Control */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-base/80 rounded-lg px-3 py-2">
          <Volume2 size={16} className="text-ink/70" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-ink/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div className="p-4 bg-base/70">
        <h3 className="font-semibold">
          {isPlaying ? "Now Playing" : "Paused"}
        </h3>
        <p className="text-sm text-muted">
          {currentTrack.artist} — {currentTrack.title}
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={previousTrack}
            className="h-10 w-10 rounded-full bg-ink/20 hover:bg-ink/30 flex items-center justify-center transition-colors"
          >
            <SkipBack size={18} className="text-ink" />
          </button>
          <button
            onClick={togglePlayPause}
            className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause size={20} className="text-on-accent" fill="currentColor" />
            ) : (
              <Play
                size={20}
                className="text-on-accent ml-0.5"
                fill="currentColor"
              />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="h-10 w-10 rounded-full bg-ink/20 hover:bg-ink/30 flex items-center justify-center transition-colors"
          >
            <SkipForward size={18} className="text-ink" />
          </button>
        </div>

        {/* Track indicator */}
        {playlist.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {playlist.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTrackIndex
                    ? "bg-accent"
                    : "bg-ink/30 hover:bg-ink/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
