export type CastleTool = "tower" | "wall" | "flag" | "erase";
export type CastlePiece = {
  id: number;
  kind: Exclude<CastleTool, "erase">;
  x: number;
  z: number;
  rotated: boolean;
};
export type CastleState = { pieces: CastlePiece[]; history: CastlePiece[][]; nextId: number; message: string };
export type CastleAction =
  | { type: "place"; tool: CastleTool; x: number; z: number; rotated: boolean }
  | { type: "undo" }
  | { type: "clear" };

export const BEACH_COLUMNS = 7;
export const BEACH_ROWS = 5;
export const initialCastle: CastleState = {
  pieces: [
    { id: 1, kind: "tower", x: -1, z: 0, rotated: false },
    { id: 2, kind: "wall", x: 0, z: 0, rotated: false },
    { id: 3, kind: "tower", x: 1, z: 0, rotated: false },
    { id: 4, kind: "flag", x: 1, z: 0, rotated: false },
  ],
  history: [], nextId: 5,
  message: "A little head start. Choose a tool and make it yours.",
};

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
  if (tool === "erase") {
    if (!atSpot.length) return { ...state, message: "Choose a piece to remove." };
    const flag = atSpot.find(piece => piece.kind === "flag");
    return save(state.pieces.filter(piece => flag ? piece.id !== flag.id : !(piece.x === x && piece.z === z)), flag ? "Flag removed." : "Sand cleared from that spot.");
  }
  if (tool === "flag" ? atSpot.some(piece => piece.kind === "flag") : atSpot.some(piece => piece.kind !== "flag")) {
    return { ...state, message: tool === "flag" ? "There’s already a flag there. Pick another spot." : "That spot is taken. Try the open sand, or use the eraser." };
  }
  return save([...state.pieces, { id: state.nextId, kind: tool, x, z, rotated }], `${tool === "tower" ? "Tower" : tool === "wall" ? "Wall" : "Flag"} added.`, state.nextId + 1);
}
