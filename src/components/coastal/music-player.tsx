"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import localFont from "next/font/local";
import { Pause, Play, SkipForward, Volume2 } from "lucide-react";
import styles from "./coastal.module.css";
import { Button } from "@/components/ui/button";

const radioScript = localFont({
  src: "../../../public/fonts/Yellowtail-Regular.woff2",
  weight: "400",
  display: "swap",
  preload: false,
});

const tracks = [
  {
    title: "Good Vibrations",
    artist: "The Beach Boys",
    src: "/music/audio/The-Beach-Boys-Good-Vibrations.mp3",
  },
  {
    title: "Praise",
    artist: "Panda Bear",
    src: "/music/audio/Panda-Bear-Praise.mp3",
  },
  {
    title: "After The Earthquake",
    artist: "Alvvays",
    src: "/music/audio/alvvays-after-the-earthquake.mp3",
  },
  {
    title: "Afterlife",
    artist: "Sharon Van Etten",
    src: "/music/audio/Sharon-Van-Etten-Afterlife.mp3",
  },
];

export function CoastalMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const resumeAfterChange = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState("");
  const track = tracks[index];
  const title = playing ? track.title : started ? "Paused" : "Ready";
  const titleBox = useRef<HTMLParagraphElement>(null);
  const titleText = useRef<HTMLSpanElement>(null);
  // How far a title wider than the LCD has to slide to show its last letter.
  const [overflow, setOverflow] = useState(0);
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

  useLayoutEffect(() => {
    const box = titleBox.current;
    const text = titleText.current;
    if (!box || !text) return;
    const measure = () =>
      setOverflow(Math.max(0, Math.ceil(text.offsetWidth - box.clientWidth)));
    measure();
    // Re-measure when the card resizes or the font finishes loading.
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(text);
    return () => observer.disconnect();
  }, [title]);

  return (
    <div className={styles.music} role="region" aria-label="Music radio">
      <audio
        ref={audio}
        src={track.src}
        preload="none"
        onPlaying={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={next}
        onError={() => {
          setPlaying(false);
          setError("This track is unavailable. Try the next track.");
        }}
      />
      <div className={styles.radioAntenna} aria-hidden="true" />
      <div className={styles.radioHandle} aria-hidden="true" />
      <div className={styles.radioBody}>
        <div className={styles.radioLabel} aria-hidden="true">
          <span>Radio</span>
          <span className={styles.radioPower} data-on={playing}>●</span>
        </div>
        <div
          className={styles.radioDisplay}
          data-playing={playing}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p
            ref={titleBox}
            className={styles.radioTitle}
            data-scroll={overflow > 0 || undefined}
            style={
              {
                "--lcd-distance": `-${overflow}px`,
                "--lcd-duration": `${Math.max(5, overflow / 20 + 3)}s`,
              } as CSSProperties
            }
          >
            <span ref={titleText}>{title}</span>
          </p>
          <p className={styles.radioArtist}>
            {playing ? track.artist : "Press play to listen"}
          </p>
        </div>
        <div className={styles.radioSpeaker} aria-hidden="true">
          <span className={`${styles.radioBadge} ${radioScript.className}`}>
            Tidecaster
          </span>
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
          <Button
            variant="circle"
            size="lg"
            onClick={next}
            aria-label="Next track"
          >
            <SkipForward size={19} aria-hidden="true" />
          </Button>
        </div>
        {error && (
          <p role="alert" className={styles.audioError}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
