// Single source of truth for the interactive blog "stepper" widgets.
//
// Previously each of these datasets lived — along with a full copy of the
// widget's HTML, CSS, and JS — inside a blog post's `content` string in Convex
// (the rgc-* Rust-vs-GC widget and the uhl-* Undo-vs-oplog widget). The engine
// is now one React component (BlogStepper); this file holds just the data.
// A post references a widget with <div data-stepper="rust-vs-gc"></div>.

export type ChipStyle = "accent" | "alt" | "dead" | "warn";

export interface StepperChip {
  label: string;
  meta: string;
  style: ChipStyle;
}

export interface PanelStep {
  code: string;
  /** Two zones (e.g. stack/heap, history/memory). */
  zones: [StepperChip[], StepperChip[]];
  note: string;
}

export interface PanelHeader {
  title: string;
  badge: string;
  zoneLabels: [string, string];
}

export interface StepperStep {
  /** Narration above the panels. May contain simple inline HTML. */
  banner: string;
  panels: [PanelStep, PanelStep];
}

export interface StepperConfig {
  headers: [PanelHeader, PanelHeader];
  steps: StepperStep[];
}

const rustVsGc: StepperConfig = {
  headers: [
    {
      title: "Rust — borrow checker",
      badge: "compile-time · zero runtime cost",
      zoneLabels: ["Stack (bindings)", "Heap"],
    },
    {
      title: "Garbage collector",
      badge: "runtime · traced",
      zoneLabels: ["Roots (references)", "Heap"],
    },
  ],
  steps: [
    {
      banner:
        "Both languages put a value on the heap. From here their memory strategies diverge.",
      panels: [
        {
          code: 'let s = String::from("hi");',
          zones: [
            [{ label: "s", meta: "owns #1", style: "accent" }],
            [{ label: '#1 "hi"', meta: "live", style: "accent" }],
          ],
          note: "s is the sole owner of the heap value. Exactly one owner, always.",
        },
        {
          code: 'Node a = new Node("hi");',
          zones: [
            [{ label: "a", meta: "→ A", style: "accent" }],
            [{ label: 'A "hi"', meta: "reachable", style: "accent" }],
          ],
          note: "a references a freshly allocated object.",
        },
      ],
    },
    {
      banner:
        "Rust <b>moves</b> ownership — the old name dies. A GC just adds another reference; aliasing is fine.",
      panels: [
        {
          code: "let t = s;",
          zones: [
            [
              { label: "s", meta: "moved", style: "dead" },
              { label: "t", meta: "owns #1", style: "accent" },
            ],
            [{ label: '#1 "hi"', meta: "live", style: "accent" }],
          ],
          note: "Ownership moves to t. Touching s now is a compile error. Nothing is copied.",
        },
        {
          code: "Node b = a;",
          zones: [
            [
              { label: "a", meta: "→ A", style: "accent" },
              { label: "b", meta: "→ A", style: "accent" },
            ],
            [{ label: 'A "hi"', meta: "reachable", style: "accent" }],
          ],
          note: "Two references to one object. Aliasing is allowed — there is no ownership concept.",
        },
      ],
    },
    {
      banner:
        "Rust verifies every borrow at compile time. The GC builds a reachability graph at runtime.",
      panels: [
        {
          code: "let r = &t;",
          zones: [
            [
              { label: "s", meta: "moved", style: "dead" },
              { label: "t", meta: "owns #1", style: "accent" },
              { label: "r", meta: "borrows t", style: "alt" },
            ],
            [{ label: '#1 "hi"', meta: "live", style: "accent" }],
          ],
          note: "r borrows t. The checker proves t outlives r and no aliasing rule is broken — all at compile time.",
        },
        {
          code: 'a.next = new Node("!");',
          zones: [
            [
              { label: "a", meta: "→ A", style: "accent" },
              { label: "b", meta: "→ A", style: "accent" },
            ],
            [
              { label: 'A "hi" → B', meta: "reachable", style: "accent" },
              { label: 'B "!"', meta: "reachable", style: "accent" },
            ],
          ],
          note: "The object graph grows. Reachability flows from the roots along references.",
        },
      ],
    },
    {
      banner:
        "Rust frees the value the instant its owner leaves scope — exact and predictable. The GC's objects are now garbage but still sitting in memory.",
      panels: [
        {
          code: "}   // t leaves scope",
          zones: [
            [{ label: "t", meta: "dropped", style: "dead" }],
            [{ label: '#1 "hi"', meta: "freed", style: "dead" }],
          ],
          note: "Owner leaves scope, so the value is dropped and freed right here. Deterministic, no collector.",
        },
        {
          code: "a = null; b = null;",
          zones: [
            [{ label: "—", meta: "no roots", style: "dead" }],
            [
              { label: 'A "hi" → B', meta: "unreachable", style: "warn" },
              { label: 'B "!"', meta: "unreachable", style: "warn" },
            ],
          ],
          note: "A and B are now unreachable — but still occupying memory. Nothing has been freed.",
        },
      ],
    },
    {
      banner:
        "Rust already cleaned up — there is no collector phase. The GC runs later, traces, and sweeps, costing pauses and unpredictable timing.",
      panels: [
        {
          code: "// no collector exists",
          zones: [[], [{ label: "#1 freed", meta: "freed", style: "dead" }]],
          note: "Already reclaimed at the brace above. Rust has no separate runtime collection phase at all.",
        },
        {
          code: "// GC runs (sometime later)",
          zones: [
            [{ label: "—", meta: "no roots", style: "dead" }],
            [
              { label: "A collected", meta: "collected", style: "dead" },
              { label: "B collected", meta: "collected", style: "dead" },
            ],
          ],
          note: "The collector traces from roots, marks A and B dead, then sweeps them. Timing is unpredictable.",
        },
      ],
    },
  ],
};

const undoVsOplog: StepperConfig = {
  headers: [
    {
      title: "Snapshot history",
      badge: "copy the pixels · simple",
      zoneLabels: ["History entries", "Memory footprint"],
    },
    {
      title: "Operation log",
      badge: "record the edit · replayable",
      zoneLabels: ["History entries", "Memory footprint"],
    },
  ],
  steps: [
    {
      banner:
        "One photo, 2048×2048 pixels — 16 MB of RGBA either way. From here the two undo strategies diverge.",
      panels: [
        {
          code: "load(photo)",
          zones: [
            [{ label: "#0 full copy", meta: "16 MB", style: "accent" }],
            [{ label: "total", meta: "16 MB", style: "accent" }],
          ],
          note: "The baseline state is a complete pixel buffer. So far the two strategies are identical.",
        },
        {
          code: "load(photo)",
          zones: [
            [{ label: "K0 keyframe", meta: "16 MB", style: "alt" }],
            [{ label: "total", meta: "16 MB", style: "alt" }],
          ],
          note: "A keyframe is a full snapshot too — but you only take one every N ops, not every edit.",
        },
      ],
    },
    {
      banner:
        "A snapshot copies all 16 MB for one brush stroke. The op log writes about 120 bytes.",
      panels: [
        {
          code: "brush.stroke()",
          zones: [
            [
              { label: "#0 full copy", meta: "16 MB", style: "accent" },
              { label: "#1 full copy", meta: "16 MB", style: "accent" },
            ],
            [{ label: "total", meta: "32 MB", style: "accent" }],
          ],
          note: "One stroke changed maybe 0.1% of the pixels. The snapshot copies 100% of them anyway.",
        },
        {
          code: "brush.stroke()",
          zones: [
            [
              { label: "K0 keyframe", meta: "16 MB", style: "alt" },
              { label: "op: stroke", meta: "120 B", style: "accent" },
            ],
            [{ label: "total", meta: "16.0001 MB", style: "alt" }],
          ],
          note: "The stroke is recorded as data: points, brush, pressure. Serialized, it is smaller than this sentence.",
        },
      ],
    },
    {
      banner:
        "Every edit repeats the pattern: full copies pile up on one side, tiny records on the other.",
      panels: [
        {
          code: "blur(); text.add()",
          zones: [
            [
              { label: "#0 full copy", meta: "16 MB", style: "accent" },
              { label: "#1 full copy", meta: "16 MB", style: "accent" },
              { label: "#2 full copy", meta: "16 MB", style: "accent" },
              { label: "#3 full copy", meta: "16 MB", style: "accent" },
            ],
            [{ label: "total", meta: "64 MB", style: "accent" }],
          ],
          note: "Memory grows linearly with edit count, no matter how small each edit was.",
        },
        {
          code: "blur(); text.add()",
          zones: [
            [
              { label: "K0 keyframe", meta: "16 MB", style: "alt" },
              { label: "op: stroke", meta: "120 B", style: "accent" },
              { label: "op: blur", meta: "64 B", style: "accent" },
              { label: "op: text", meta: "210 B", style: "accent" },
            ],
            [{ label: "total", meta: "16.0004 MB", style: "alt" }],
          ],
          note: "Edits append. The photo state is implied: keyframe plus every op after it.",
        },
      ],
    },
    {
      banner:
        "Undo: snapshots swap buffers instantly. The log replays from the nearest keyframe — bounded and fast.",
      panels: [
        {
          code: "undo()",
          zones: [
            [
              { label: "#0 full copy", meta: "16 MB", style: "accent" },
              { label: "#1 full copy", meta: "16 MB", style: "accent" },
              { label: "#2 full copy", meta: "restored", style: "alt" },
              { label: "#3 full copy", meta: "dropped", style: "dead" },
            ],
            [{ label: "total", meta: "48 MB", style: "accent" }],
          ],
          note: "Undo is genuinely great here: swap a pointer, done. Speed was never the problem.",
        },
        {
          code: "undo()",
          zones: [
            [
              { label: "K0 keyframe", meta: "16 MB", style: "alt" },
              { label: "op: stroke", meta: "replayed", style: "accent" },
              { label: "op: blur", meta: "replayed", style: "accent" },
              { label: "op: text", meta: "truncated", style: "dead" },
            ],
            [{ label: "total", meta: "16.0004 MB", style: "alt" }],
          ],
          note: "Undo replays from the nearest keyframe, skipping the last op. Keyframes every 50 ops bound the replay cost.",
        },
      ],
    },
    {
      banner:
        "At 200 edits: ~3.2 GB of snapshots vs ~17 MB of keyframes and ops. Only one of these fits in a browser tab.",
      panels: [
        {
          code: "// 200 edits later",
          zones: [
            [{ label: "#0 … #199", meta: "200 copies", style: "warn" }],
            [{ label: "total", meta: "~3.2 GB", style: "warn" }],
          ],
          note: "This is where my first implementation died. The only fix is capping history — losing old undo steps.",
        },
        {
          code: "// 200 edits later",
          zones: [
            [
              { label: "K0 K50 K100 K150", meta: "4 keyframes", style: "alt" },
              { label: "200 ops", meta: "~24 KB", style: "accent" },
            ],
            [{ label: "total", meta: "~17 MB", style: "alt" }],
          ],
          note: "Nearly unlimited undo for the price of a few keyframes. The history is now a file — save it, and edits survive a reload.",
        },
      ],
    },
  ],
};

export const STEPPER_CONFIGS: Record<string, StepperConfig> = {
  "rust-vs-gc": rustVsGc,
  "undo-vs-oplog": undoVsOplog,
};
