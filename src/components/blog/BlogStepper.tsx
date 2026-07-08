"use client";

import { useEffect, useState } from "react";
import "./blog-stepper.css";
import type { StepperChip, StepperConfig } from "./stepper-configs";

const STEP_INTERVAL_MS = 2200;

function Chip({ chip }: { chip: StepperChip }) {
  return (
    <div className={`bstep-chip bstep-${chip.style}`}>
      <span>{chip.label}</span>
      <span className="bstep-meta">{chip.meta}</span>
    </div>
  );
}

/**
 * Interactive stepped side-by-side comparison used in blog posts.
 * The single implementation behind the Rust-vs-GC and Undo-vs-oplog widgets;
 * data comes from STEPPER_CONFIGS (see stepper-configs.ts).
 */
export function BlogStepper({ config }: { config: StepperConfig }) {
  const steps = config.steps;
  const count = steps.length;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % count),
      STEP_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [playing, count]);

  const go = (n: number) => {
    setPlaying(false);
    setStep(((n % count) + count) % count);
  };

  const current = steps[step];

  return (
    <div className="bstep-root not-prose">
      <div
        className="bstep-banner"
        dangerouslySetInnerHTML={{ __html: current.banner }}
      />

      <div className="bstep-grid">
        {config.headers.map((header, p) => {
          const panel = current.panels[p];
          return (
            <div className="bstep-panel" key={p}>
              <div className="bstep-phead">
                <span className="bstep-ptitle">{header.title}</span>
                <span className="bstep-pbadge">{header.badge}</span>
              </div>
              <div className="bstep-code">{panel.code}</div>

              <p className="bstep-zone-label">{header.zoneLabels[0]}</p>
              <div className="bstep-zone">
                {panel.zones[0].map((chip, i) => (
                  <Chip chip={chip} key={i} />
                ))}
              </div>

              <div className="bstep-divider" />

              <p className="bstep-zone-label">{header.zoneLabels[1]}</p>
              <div className="bstep-zone">
                {panel.zones[1].map((chip, i) => (
                  <Chip chip={chip} key={i} />
                ))}
              </div>

              <p className="bstep-note">{panel.note}</p>
            </div>
          );
        })}
      </div>

      <div className="bstep-controls">
        <button
          className="bstep-btn"
          aria-label="Previous step"
          onClick={() => go(step - 1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="bstep-btn"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>

        <button
          className="bstep-btn"
          aria-label="Next step"
          onClick={() => go(step + 1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <div className="bstep-dots">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`bstep-dot${i === step ? " bstep-on" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
