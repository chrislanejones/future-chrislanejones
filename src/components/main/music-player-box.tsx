"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";

// Music playlist - add your audio files to the public folder
const playlist = [
  {
    title: "Afterlife",
    artist: "Sharon Van Etten",
    album: "Sharon Van Etten & The Attachment Theory",
    albumArt: "/music/art/Attachment-Theory.webp",
    audioSrc: "/music/audio/Sharon-Van-Etten-Afterlife.mp3",
  },
  {
    title: "After The Earthquake",
    artist: "Alvvays",
    album: "Blue Rev",
    albumArt: "/music/art/Alvvays-Blue-Rev-Album-Art.webp",
    audioSrc: "/music/audio/alvvays-after-the-earthquake.mp3",
  },
];

export default function MusicPlayerBox() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    // Load the audio
    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, [currentTrackIndex, volume]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Playback error:", error);
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(false);
    setIsLoaded(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
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
        preload="metadata"
        crossOrigin="anonymous"
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

        {/* Volume Control - Top Left */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-base/80 hover:bg-base/90 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors">
          <Volume2 size={16} className="text-ink/70" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-2 bg-ink/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Play Controls - Top Right Corner */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="h-12 w-12 rounded-full bg-base/80 hover:bg-base/90 backdrop-blur-sm flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg"
            disabled={!isLoaded}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} className="text-ink" fill="currentColor" />
            ) : (
              <Play size={20} className="text-ink ml-0.5" fill="currentColor" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="h-10 w-10 rounded-full bg-base/80 hover:bg-base/90 backdrop-blur-sm flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg"
            disabled={!isLoaded}
            aria-label="Next track"
          >
            <SkipForward size={18} className="text-ink" />
          </button>
        </div>
      </div>

      <div className="p-6 bg-base/70">
        <h3 className="font-bold text-lg">
          {isPlaying
            ? "Now Playing"
            : isLoaded
            ? "Ready to Play"
            : "Loading..."}
        </h3>
        <p className="text-sm text-muted">
          {currentTrack.artist} — {currentTrack.title}
        </p>
      </div>
    </motion.article>
  );
}
