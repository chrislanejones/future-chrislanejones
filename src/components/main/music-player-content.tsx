// src/components/main/music-player-content.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardMedia, CardFooter } from "@/components/page/card";
import Image from "next/image";

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
    setIsPlaying(true);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Playback error:", err);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        crossOrigin="anonymous"
      />
      <Card
        size="large"
        height="large"
        layout="media-top"
        className="overflow-hidden flex flex-col"
      >
        <CardMedia>
          <Image
            src={currentTrack.artwork}
            alt={`${currentTrack.album} artwork`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent" />

          {/* Volume Control */}
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-panel/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-sm transition-all hover:shadow-md">
              <Volume2
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--color-accent)" }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="volume-slider w-16 h-2"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>

          {/* Skip Forward Button */}
          <div className="absolute top-4 right-4 z-20">
            <Button
              onClick={handleNext}
              variant="neutral"
              size="icon"
              round
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5 text-ink" />
            </Button>
          </div>
        </CardMedia>

        {/* Player Controls */}
        <CardFooter className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-ink">
              {currentTrack.artist} - {currentTrack.title}
            </p>
          </div>
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
      </Card>

      <style jsx>{`
        .volume-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 5px;
          background: linear-gradient(
            to right,
            var(--color-accent) 0%,
            var(--color-accent) ${volume * 100}%,
            rgba(107, 114, 128, 0.3) ${volume * 100}%,
            rgba(107, 114, 128, 0.3) 100%
          );
          cursor: pointer;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: var(--color-accent);
          border: 2px solid var(--color-panel);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
          transition: all 150ms ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.5);
        }

        .volume-slider::-moz-range-track {
          background: transparent;
          border: none;
        }

        .volume-slider::-moz-range-progress {
          background: var(--color-accent);
          border-radius: 5px;
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--color-accent);
          border: 2px solid var(--color-panel);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
          transition: all 150ms ease;
        }

        .volume-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.5);
        }

        .dark .volume-slider {
          background: linear-gradient(
            to right,
            var(--color-accent) 0%,
            var(--color-accent) ${volume * 100}%,
            rgba(255, 255, 255, 0.1) ${volume * 100}%,
            rgba(255, 255, 255, 0.1) 100%
          );
        }
      `}</style>
    </>
  );
}
