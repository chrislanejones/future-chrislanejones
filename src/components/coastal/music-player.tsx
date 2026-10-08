"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play, SkipForward, Volume2 } from "lucide-react";
import styles from "./coastal.module.css";

const tracks = [
  {
    title: "Afterlife",
    artist: "Sharon Van Etten",
    artwork: "/music/art/Attachment-Theory.webp",
    src: "/music/audio/Sharon-Van-Etten-Afterlife.mp3",
  },
  {
    title: "Praise",
    artist: "Panda Bear",
    artwork: "/music/art/Panda-Bear-Sinister-Grift.webp",
    src: "/music/audio/Panda-Bear-Praise.mp3",
  },
  {
    title: "After The Earthquake",
    artist: "Alvvays",
    artwork: "/music/art/Alvvays-Blue-Rev-Album-Art.webp",
    src: "/music/audio/alvvays-after-the-earthquake.mp3",
  },
];

export function CoastalMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const resumeAfterChange = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState("");
  const track = tracks[index];
  async function play() {
    setError("");
    try {
      await audio.current?.play();
    } catch {
      setPlaying(false);
      setError("Playback couldn’t start. Try pressing play again.");
    }
  }
  function next() {
    resumeAfterChange.current = playing || Boolean(audio.current?.ended);
    setError("");
    setIndex((current) => (current + 1) % tracks.length);
  }

  // Wait for React to commit the new source before resuming playback. Updating
  // src imperatively as well can interrupt play() with a second media load.
  useEffect(() => {
    if (!resumeAfterChange.current || !audio.current) return;
    resumeAfterChange.current = false;
    void audio.current.play().catch(() => {
      setPlaying(false);
      setError("Playback couldn’t start. Try pressing play again.");
    });
  }, [index]);

  return (
    <div className={styles.music}>
      <audio
        ref={audio}
        src={track.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
        onError={() => {
          setPlaying(false);
          setError("This track is unavailable. Try the next track.");
        }}
      />
      <div className={styles.musicHeader}>
        <h3>On repeat</h3>
        <span>The coding soundtrack</span>
      </div>
      <div className={styles.albumArt}>
        <Image
          src={track.artwork}
          alt={`${track.artist} album artwork`}
          fill
          sizes="(max-width: 767px) 80vw, 25vw"
          className={styles.coverImage}
        />
      </div>
      <div className={styles.trackInfo} aria-live="polite">
        <h4>{track.title}</h4>
        <p>{track.artist}</p>
      </div>
      <div className={styles.playerControls}>
        <Volume2 size={17} aria-hidden="true" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          aria-label="Volume"
          onChange={(event) => {
            const value = Number(event.target.value);
            setVolume(value);
            if (audio.current) audio.current.volume = value;
          }}
        />
        <button
          type="button"
          className={styles.playButton}
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => {
            if (playing) audio.current?.pause();
            else {
              if (audio.current) audio.current.volume = volume;
              void play();
            }
          }}
        >
          {playing ? (
            <Pause size={19} aria-hidden="true" />
          ) : (
            <Play size={19} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className={styles.circleButton}
          onClick={next}
          aria-label="Next track"
        >
          <SkipForward size={19} aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p role="alert" className={styles.audioError}>
          {error}
        </p>
      )}
    </div>
  );
}
