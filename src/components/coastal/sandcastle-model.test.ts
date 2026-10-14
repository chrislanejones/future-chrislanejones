import { describe, expect, test } from "vitest";
import { castleReducer, moundsAt, MOUND_HEIGHT, onBeach, pieceElevation, PIECE_HEIGHT, type CastleState, type CastleTool } from "./sandcastle-model";

const empty: CastleState = { pieces: [], history: [], nextId: 1, message: "" };
const play = (state: CastleState, ...moves: [CastleTool, number, number][]) =>
  moves.reduce((s, [tool, x, z]) => castleReducer(s, { type: "place", tool, x, z, rotated: false }), state);

describe("the beach", () => {
  test("is 9 by 7 spots", () => {
    expect(onBeach(4, 3)).toBe(true);
    expect(onBeach(-4, -3)).toBe(true);
    expect(onBeach(5, 0)).toBe(false);
    expect(onBeach(0, 4)).toBe(false);
    expect(onBeach(.5, 0)).toBe(false);
  });
  test("ignores taps off the sand", () => {
    expect(play(empty, ["tower", 5, 0])).toBe(empty);
  });
});

describe("moldable sand", () => {
  test("piling heaps up to two mounds", () => {
    const s = play(empty, ["pile", 0, 0], ["pile", 0, 0], ["pile", 0, 0]);
    expect(moundsAt(s.pieces, 0, 0)).toBe(2);
    expect(s.message).toMatch(/as tall as the sand/);
  });
  test("pieces built on a mound sit higher", () => {
    const s = play(empty, ["pile", 0, 0], ["pile", 0, 0], ["bucket", 0, 0], ["tower", 0, 0]);
    const tower = s.pieces.find(p => p.kind === "tower")!;
    expect(pieceElevation(s.pieces, tower)).toBeCloseTo(2 * MOUND_HEIGHT + PIECE_HEIGHT.bucket);
  });
  test("digging lowers a mound before it cuts a moat", () => {
    let s = play(empty, ["pile", 0, 0], ["moat", 0, 0]);
    expect(moundsAt(s.pieces, 0, 0)).toBe(0);
    expect(s.pieces.some(p => p.kind === "moat")).toBe(false);
    s = play(s, ["moat", 0, 0]);
    expect(s.pieces.filter(p => p.kind === "moat")).toHaveLength(1);
  });
  test("piling on a moat fills it back in", () => {
    const s = play(empty, ["moat", 0, 0], ["pile", 0, 0]);
    expect(s.pieces).toHaveLength(0);
    expect(s.message).toMatch(/filled back in/);
  });
  test("you can't pile or dig under a castle", () => {
    const s = play(empty, ["tower", 0, 0]);
    expect(play(s, ["pile", 0, 0]).pieces).toEqual(s.pieces);
    expect(play(s, ["moat", 0, 0]).pieces).toEqual(s.pieces);
  });
  test("erasing removes the castle before the sand under it", () => {
    let s = play(empty, ["pile", 0, 0], ["tower", 0, 0], ["flag", 0, 0]);
    s = play(s, ["erase", 0, 0]);
    expect(s.pieces.map(p => p.kind).sort()).toEqual(["mound", "tower"]);
    s = play(s, ["erase", 0, 0], ["erase", 0, 0]);
    expect(s.pieces).toHaveLength(0);
  });
  test("nothing can be built in a moat", () => {
    const s = play(empty, ["moat", 0, 0]);
    expect(play(s, ["tower", 0, 0]).message).toMatch(/moat/);
    expect(play(s, ["flag", 0, 0]).message).toMatch(/sink/);
  });
});

describe("stacking still works", () => {
  test("bucket, bucket, tower is the tallest", () => {
    const s = play(empty, ["bucket", 0, 0], ["bucket", 0, 0], ["tower", 0, 0], ["bucket", 0, 0]);
    expect(s.pieces.map(p => p.level)).toEqual([0, 1, 2]);
    expect(s.message).toMatch(/Three stories/);
  });
  test("undo restores the sand too", () => {
    const s = play(empty, ["pile", 0, 0], ["pile", 0, 0]);
    expect(moundsAt(castleReducer(s, { type: "undo" }).pieces, 0, 0)).toBe(1);
  });
});
