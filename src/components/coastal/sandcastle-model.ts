export type CastleTool = "tower" | "bucket" | "wall" | "moat" | "flag" | "shell" | "erase";
export type CastleKind = Exclude<CastleTool, "erase">;
export type CastlePiece = {
  id: number;
  kind: CastleKind;
  x: number;
  z: number;
  rotated: boolean;
  /** 0 sits on the sand; 1 and 2 sit on stacked buckets. */
  level: 0 | 1 | 2;
};
export type CastleState = { pieces: CastlePiece[]; history: CastlePiece[][]; nextId: number; message: string };
export type CastleAction =
  | { type: "place"; tool: CastleTool; x: number; z: number; rotated: boolean }
  | { type: "undo" }
  | { type: "clear" };

export const BEACH_COLUMNS = 7;
export const BEACH_ROWS = 5;
/** Structures take up a spot; decorations sit on whatever is there. */
const STRUCTURES: ReadonlySet<CastleKind> = new Set(["tower", "bucket", "wall", "moat"]);
const STACKABLE: ReadonlySet<CastleKind> = new Set(["tower", "bucket"]);
/** Three stories max: bucket, bucket, then a tower (or bucket) on top. */
const MAX_LEVEL = 2;
/** How tall each piece is, so flags, shells, and stacked pieces know where to sit. */
export const PIECE_HEIGHT: Record<CastleKind, number> = { tower: 1.4, bucket: 1.02, wall: .85, moat: 0, flag: 0, shell: 0 };
const LABEL: Record<CastleKind, string> = { tower: "Tower", bucket: "Bucket castle", wall: "Wall", moat: "Moat", flag: "Flag", shell: "Shell" };

export const initialCastle: CastleState = {
  pieces: [
    { id: 1, kind: "tower", x: -1, z: 0, rotated: false, level: 0 },
    { id: 2, kind: "wall", x: 0, z: 0, rotated: false, level: 0 },
    { id: 3, kind: "bucket", x: 1, z: 0, rotated: false, level: 0 },
    { id: 4, kind: "flag", x: 1, z: 0, rotated: false, level: 0 },
  ],
  history: [], nextId: 5,
  message: "A little head start. Choose a tool and make it yours.",
};

export function isStructure(kind: CastleKind) { return STRUCTURES.has(kind); }

/** Height of the sand-plus-structures at a spot, where a decoration or the next stacked piece would rest. */
export function spotTop(pieces: CastlePiece[], x: number, z: number) {
  return pieces.filter(p => p.x === x && p.z === z && isStructure(p.kind)).reduce((top, p) => top + PIECE_HEIGHT[p.kind], 0);
}

/** Height the piece itself rests at: the structures stacked beneath it. */
export function pieceElevation(pieces: CastlePiece[], piece: CastlePiece) {
  return pieces
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
  const { tool, x, z, rotated } = action;
  if (!Number.isInteger(x) || !Number.isInteger(z) || Math.abs(x) > 3 || Math.abs(z) > 2) return state;
  const atSpot = state.pieces.filter(piece => piece.x === x && piece.z === z);
  const structures = atSpot.filter(piece => isStructure(piece.kind)).sort((a, b) => b.level - a.level);
  const topStructure = structures[0];

  if (tool === "erase") {
    if (!atSpot.length) return { ...state, message: "Choose a piece to remove." };
    // Top down: decorations first, then the highest stacked piece, then the base.
    const target = atSpot.find(piece => piece.kind === "flag") ?? atSpot.find(piece => piece.kind === "shell") ?? topStructure;
    if (!target) return state;
    const message = target.kind === "flag" ? "Flag removed." : target.kind === "shell" ? "Shell picked up." : target.level === 1 ? "Top piece knocked off." : "Sand cleared from that spot.";
    return save(state.pieces.filter(piece => piece.id !== target.id), message);
  }

  const place = (level: 0 | 1 | 2, message: string) =>
    save([...state.pieces, { id: state.nextId, kind: tool, x, z, rotated, level }], fortMessage([...state.pieces, { id: state.nextId, kind: tool, x, z, rotated, level }], message), state.nextId + 1);

  if (tool === "flag" || tool === "shell") {
    if (atSpot.some(piece => piece.kind === tool)) return { ...state, message: `There’s already a ${tool} there. Pick another spot.` };
    if (topStructure?.kind === "moat") return { ...state, message: `A ${tool} would sink in the moat. Try the sand or a castle.` };
    return place(0, `${LABEL[tool]} added${topStructure ? ` on the ${LABEL[topStructure.kind].toLowerCase()}` : ""}.`);
  }

  if (!topStructure) return place(0, `${LABEL[tool]} added.`);
  if (topStructure.kind === "bucket" && topStructure.level < MAX_LEVEL && STACKABLE.has(tool)) {
    if (atSpot.some(piece => piece.kind === "flag" || piece.kind === "shell")) return { ...state, message: "Clear the flag or shell off that bucket before stacking on it." };
    const level = (topStructure.level + 1) as 1 | 2;
    return place(level, `${LABEL[tool]} stacked on the bucket. ${level === 2 ? "Three stories tall, as high as the sand will hold." : "Two stories tall. One more will fit."}`);
  }
  if (topStructure.level >= MAX_LEVEL) return { ...state, message: "Three stories is as high as the sand will hold." };
  if (topStructure.kind === "bucket") return { ...state, message: "Only a tower or another bucket can sit on a bucket." };
  return { ...state, message: "That spot is taken. Try the open sand, stack on a bucket, or use the eraser." };
}
