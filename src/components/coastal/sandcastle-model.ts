export type CastleTool = "tower" | "bucket" | "wall" | "moat" | "pile" | "flag" | "shell" | "erase";
/** "mound" is the sand the pile tool heaps up; it isn't a tool name of its own. */
export type CastleKind = Exclude<CastleTool, "erase" | "pile"> | "mound";
export type CastlePiece = {
  id: number;
  kind: CastleKind;
  x: number;
  z: number;
  rotated: boolean;
  /** 0 sits on the sand (or its mound); 1 and 2 sit on stacked buckets. */
  level: 0 | 1 | 2;
};
export type CastleState = { pieces: CastlePiece[]; history: CastlePiece[][]; nextId: number; message: string };
export type CastleAction =
  | { type: "place"; tool: CastleTool; x: number; z: number; rotated: boolean }
  | { type: "rotate"; x: number; z: number }
  | { type: "undo" }
  | { type: "clear" };

export const BEACH_COLUMNS = 9;
export const BEACH_ROWS = 7;
/** Spots run from -HALF_X..HALF_X and -HALF_Z..HALF_Z, centered on the beach. */
export const HALF_X = (BEACH_COLUMNS - 1) / 2;
export const HALF_Z = (BEACH_ROWS - 1) / 2;
export function onBeach(x: number, z: number) {
  return Number.isInteger(x) && Number.isInteger(z) && Math.abs(x) <= HALF_X && Math.abs(z) <= HALF_Z;
}

/** Structures take up a spot; decorations sit on whatever is there. Mounds are the sand itself. */
const STRUCTURES: ReadonlySet<CastleKind> = new Set(["tower", "bucket", "wall", "moat"]);
const STACKABLE: ReadonlySet<CastleKind> = new Set(["tower", "bucket"]);
/** Three stories max: bucket, bucket, then a tower (or bucket) on top. */
const MAX_LEVEL = 2;
/** Two piles of sand make the tallest dune. */
const MAX_MOUNDS = 2;
/** How much one pile raises the sand, and how deep a moat is dug. */
export const MOUND_HEIGHT = .28;
export const MOAT_DEPTH = .3;
/** How tall each piece is, so flags, shells, and stacked pieces know where to sit. */
export const PIECE_HEIGHT: Record<CastleKind, number> = { tower: 1.4, bucket: 1.02, wall: .85, moat: 0, flag: 0, shell: 0, mound: MOUND_HEIGHT };
const LABEL: Record<CastleKind, string> = { tower: "Tower", bucket: "Bucket castle", wall: "Wall", moat: "Moat", flag: "Flag", shell: "Shell", mound: "Mound" };

export const initialCastle: CastleState = {
  pieces: [
    { id: 1, kind: "mound", x: 1, z: 0, rotated: false, level: 0 },
    { id: 2, kind: "tower", x: -1, z: 0, rotated: false, level: 0 },
    { id: 3, kind: "wall", x: 0, z: 0, rotated: false, level: 0 },
    { id: 4, kind: "bucket", x: 1, z: 0, rotated: false, level: 0 },
    { id: 5, kind: "flag", x: 1, z: 0, rotated: false, level: 0 },
    { id: 6, kind: "moat", x: -1, z: 1, rotated: false, level: 0 },
    { id: 7, kind: "moat", x: 0, z: 1, rotated: false, level: 0 },
    { id: 8, kind: "moat", x: 1, z: 1, rotated: false, level: 0 },
  ],
  history: [], nextId: 9,
  message: "A little head start. Choose a tool and make it yours.",
};

export function isStructure(kind: CastleKind) { return STRUCTURES.has(kind); }

/** How many piles of sand are heaped on a spot (0 to 2). */
export function moundsAt(pieces: CastlePiece[], x: number, z: number) {
  return pieces.filter(p => p.kind === "mound" && p.x === x && p.z === z).length;
}

/** Height of the sand-plus-structures at a spot, where a decoration or the next stacked piece would rest. */
export function spotTop(pieces: CastlePiece[], x: number, z: number) {
  return pieces.filter(p => p.x === x && p.z === z && (isStructure(p.kind) || p.kind === "mound")).reduce((top, p) => top + PIECE_HEIGHT[p.kind], 0);
}

/** Height the piece itself rests at: the mound under it plus the structures stacked beneath it. */
export function pieceElevation(pieces: CastlePiece[], piece: CastlePiece) {
  if (piece.kind === "mound" || piece.kind === "moat") return 0;
  return moundsAt(pieces, piece.x, piece.z) * MOUND_HEIGHT + pieces
    .filter(p => p.x === piece.x && p.z === piece.z && isStructure(p.kind) && (isStructure(piece.kind) ? p.level < piece.level : true))
    .reduce((top, p) => top + PIECE_HEIGHT[p.kind], 0);
}

function fortMessage(pieces: CastlePiece[], added: string) {
  const corners = pieces.filter(p => p.kind === "tower" || p.kind === "bucket").length;
  const walls = pieces.filter(p => p.kind === "wall").length;
  if (corners >= 4 && walls >= 4 && pieces.some(p => p.kind === "moat")) return `${added} Towers, walls, and a moat: that’s a proper fort.`;
  if (corners >= 4 && walls >= 4) return `${added} Four corners and four walls: that’s a fort. A moat would finish it.`;
  return added;
}

export function castleReducer(state: CastleState, action: CastleAction): CastleState {
  const save = (pieces: CastlePiece[], message: string, nextId = state.nextId): CastleState => ({
    pieces, message, nextId, history: [...state.history.slice(-49), state.pieces],
  });
  if (action.type === "undo") {
    const previous = state.history.at(-1);
    return previous ? { ...state, pieces: previous, history: state.history.slice(0, -1), message: "Last change undone." } : state;
  }
  if (action.type === "clear") return state.pieces.length ? save([], "Fresh sand. Build something new.") : state;
  if (action.type === "rotate") {
    const wall = state.pieces.find(piece => piece.kind === "wall" && piece.x === action.x && piece.z === action.z);
    if (!wall) return { ...state, message: "Point the marker at a wall to turn it." };
    return save(state.pieces.map(piece => piece.id === wall.id ? { ...piece, rotated: !piece.rotated } : piece), "Wall turned.");
  }
  const { tool, x, z, rotated } = action;
  if (!onBeach(x, z)) return state;
  const atSpot = state.pieces.filter(piece => piece.x === x && piece.z === z);
  const structures = atSpot.filter(piece => isStructure(piece.kind)).sort((a, b) => b.level - a.level);
  const topStructure = structures[0];
  const mounds = atSpot.filter(piece => piece.kind === "mound");
  const topMound = mounds.at(-1);
  const decorated = atSpot.some(piece => piece.kind === "flag" || piece.kind === "shell");
  const moat = structures.find(piece => piece.kind === "moat");

  if (tool === "erase") {
    if (!atSpot.length) return { ...state, message: "Choose a piece to remove." };
    // Top down: decorations first, then the highest stacked piece, then the base, then the sand heaped under it.
    const target = atSpot.find(piece => piece.kind === "flag") ?? atSpot.find(piece => piece.kind === "shell") ?? topStructure ?? topMound;
    if (!target) return state;
    const message = target.kind === "flag" ? "Flag removed." : target.kind === "shell" ? "Shell picked up." : target.kind === "mound" ? "Mound smoothed flat." : target.kind === "moat" ? "Moat filled in." : target.level === 1 ? "Top piece knocked off." : "Sand cleared from that spot.";
    return save(state.pieces.filter(piece => piece.id !== target.id), message);
  }

  const add = (kind: CastleKind, level: 0 | 1 | 2, message: string) => {
    const pieces = [...state.pieces, { id: state.nextId, kind, x, z, rotated, level }];
    return save(pieces, fortMessage(pieces, message), state.nextId + 1);
  };

  // The sand itself: piling heaps it up (or fills a moat back in); digging lowers a mound or cuts a moat.
  if (tool === "pile") {
    if (moat) return save(state.pieces.filter(piece => piece.id !== moat.id), "Moat filled back in with sand.");
    if (topStructure || decorated) return { ...state, message: "Pile sand on open sand or on another mound." };
    if (mounds.length >= MAX_MOUNDS) return { ...state, message: "That dune is as tall as the sand will hold." };
    return add("mound", 0, mounds.length ? "A taller dune. Build on it to stand above the rest." : "Sand piled up. Anything you build here sits higher.");
  }
  if (tool === "moat") {
    if (moat) return { ...state, message: "Already dug. Dig next to it to join the moat." };
    if (topStructure || decorated) return { ...state, message: "Clear that spot before digging there." };
    if (topMound) return save(state.pieces.filter(piece => piece.id !== topMound.id), "Dug the mound back down.");
    return add("moat", 0, "Moat dug. The sea seeps in.");
  }

  if (tool === "flag" || tool === "shell") {
    if (atSpot.some(piece => piece.kind === tool)) return { ...state, message: `There’s already a ${tool} there. Pick another spot.` };
    if (moat) return { ...state, message: `A ${tool} would sink in the moat. Try the sand or a castle.` };
    const on = topStructure ? ` on the ${LABEL[topStructure.kind].toLowerCase()}` : topMound ? " on the mound" : "";
    return add(tool, 0, `${LABEL[tool]} added${on}.`);
  }

  if (!topStructure) return add(tool, 0, `${LABEL[tool]} added${topMound ? " on the mound" : ""}.`);
  // Tapping a wall with the wall tool turns it instead of refusing.
  if (tool === "wall" && topStructure.kind === "wall") return castleReducer(state, { type: "rotate", x, z });
  if (topStructure.kind === "bucket" && topStructure.level < MAX_LEVEL && STACKABLE.has(tool)) {
    if (decorated) return { ...state, message: "Clear the flag or shell off that bucket before stacking on it." };
    const level = (topStructure.level + 1) as 1 | 2;
    return add(tool, level, `${LABEL[tool]} stacked on the bucket. ${level === 2 ? "Three stories tall, as high as the sand will hold." : "Two stories tall. One more will fit."}`);
  }
  if (topStructure.level >= MAX_LEVEL) return { ...state, message: "Three stories is as high as the sand will hold." };
  if (topStructure.kind === "bucket") return { ...state, message: "Only a tower or another bucket can sit on a bucket." };
  if (topStructure.kind === "moat") return { ...state, message: "That spot is a moat. Pile sand to fill it, or build beside it." };
  return { ...state, message: "That spot is taken. Try the open sand, stack on a bucket, or use the eraser." };
}
