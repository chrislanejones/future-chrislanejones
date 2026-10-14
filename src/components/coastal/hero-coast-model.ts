import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry,
  IcosahedronGeometry, Matrix4, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// An original, simplified model guided by Chris's St Augustine Beach photos.
// Positions and building dimensions are compositional, not surveyed map data.
// X points toward the sea; Z follows A1A. No map tiles or remote assets are used.
type Layer = "architecture" | "roof" | "glass" | "ground" | "foliage" | "wood" | "water";
const LAYERS: Layer[] = ["architecture", "roof", "glass", "ground", "foliage", "wood", "water"];
export type CoastalTown = Record<Layer, BufferGeometry>;
const rand = (seed: number) => { const v = Math.sin(seed * 127.1 + 31.7) * 43758.5453; return v - Math.floor(v); };
const CROSS_STREETS = [-124, -109, -94, -79, -64, -49, -39, -19, -5, 10, 25, 40, 55];

function hipRoof(w: number, d: number, rise: number): BufferGeometry {
  // Keep a real ridge along the long side of narrow beach houses.
  if (d > w) return hipRoof(d, w, rise).rotateY(Math.PI / 2);
  const a = [-w / 2, 0, -d / 2], b = [w / 2, 0, -d / 2];
  const c = [w / 2, 0, d / 2], e = [-w / 2, 0, d / 2];
  const r1 = [-Math.max(0, w / 2 - d / 2), rise, 0];
  const r2 = [Math.max(0, w / 2 - d / 2), rise, 0];
  const points = [...a, ...r1, ...b, ...b, ...r1, ...r2,
    ...b, ...r2, ...c, ...c, ...r2, ...e, ...e, ...r2, ...r1, ...e, ...r1, ...a];
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(points), 3));
  g.computeVertexNormals();
  return g;
}

function gableRoof(w: number, d: number, rise: number) {
  const a = [-w / 2, 0, -d / 2], b = [w / 2, 0, -d / 2];
  const c = [w / 2, 0, d / 2], e = [-w / 2, 0, d / 2];
  const r1 = [0, rise, -d / 2], r2 = [0, rise, d / 2];
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array([
    ...a, ...r1, ...b, ...e, ...c, ...r2,
    ...a, ...e, ...r2, ...a, ...r2, ...r1,
    ...b, ...r1, ...r2, ...b, ...r2, ...c,
  ]), 3));
  g.computeVertexNormals();
  return g;
}

/** Merge the static miniature into seven draw calls, even with windows and palms. */
export function makeCoastalTown(): CoastalTown {
  const parts: Record<Layer, BufferGeometry[]> = { architecture: [], roof: [], glass: [], ground: [], foliage: [], wood: [], water: [] };
  const add = (layer: Layer, input: BufferGeometry, color: string, x: number, y: number, z: number, rotation = 0) => {
    const g = input.index ? input.toNonIndexed() : input;
    if (g !== input) input.dispose();
    g.deleteAttribute("uv");
    g.rotateY(rotation); g.translate(x, y, z);
    const c = new Color(color), values = new Float32Array(g.getAttribute("position").count * 3);
    for (let i = 0; i < values.length; i += 3) { values[i] = c.r; values[i + 1] = c.g; values[i + 2] = c.b; }
    g.setAttribute("color", new BufferAttribute(values, 3));
    parts[layer].push(g);
  };
  const box = (layer: Layer, color: string, x: number, y: number, z: number, w: number, h: number, d: number, turn = 0) =>
    add(layer, new BoxGeometry(w, h, d), color, x, y, z, turn);
  const roof = (x: number, y: number, z: number, w: number, d: number, rise: number, color: string, variant = 0) => {
    const geometry = variant === 1 ? gableRoof(w, d, rise) : variant === 2 ? gableRoof(d, w, rise).rotateY(Math.PI / 2) : hipRoof(w, d, rise);
    add("roof", geometry, color, x, y, z);
    box("architecture", "#f5eee0", x, y - .05, z, w, .1, d);
  };
  const pole = (a: Vector3, b: Vector3, radius: number, color: string, layer: Layer = "wood") => {
    const direction = b.clone().sub(a);
    const g = new CylinderGeometry(radius * .8, radius, direction.length(), 6);
    g.applyMatrix4(new Matrix4().compose(a.clone().add(b).multiplyScalar(.5), new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize()), new Vector3(1, 1, 1)));
    add(layer, g, color, 0, 0, 0);
  };
  const palm = (x: number, z: number, seed: number, small = false) => {
    const h = (1.8 + rand(seed) * 1.2) * (small ? .6 : 1);
    const top = new Vector3(x + .25, h, z + .1);
    pole(new Vector3(x, .05, z), top, .065, "#958366");
    for (let n = 0; n < 9; n++) {
      const angle = n * Math.PI * 2 / 9 + seed;
      const length = (small ? .72 : 1.2) * (.78 + rand(seed + n) * .4);
      const verts: number[] = [];
      for (let j = 0; j < 5; j++) {
        const t = j / 5, u = (j + 1) / 5;
        const point = (v: number, side: number) => [
          top.x + Math.cos(angle) * v * length + Math.sin(angle) * Math.sin(v * Math.PI) * .23 * side,
          top.y + Math.sin(v * Math.PI) * (.25 + rand(seed + n) * .2) - v * v * .5,
          top.z + Math.sin(angle) * v * length - Math.cos(angle) * Math.sin(v * Math.PI) * .23 * side,
        ];
        verts.push(...point(t, -1), ...point(u, -1), ...point(t, 1), ...point(t, 1), ...point(u, -1), ...point(u, 1));
      }
      const g = new BufferGeometry(); g.setAttribute("position", new BufferAttribute(new Float32Array(verts), 3)); g.computeVertexNormals();
      add("foliage", g, ["#4e7051", "#718756", "#8e9c69"][n % 3], 0, 0, 0);
    }
  };
  const bush = (x: number, z: number, seed: number, size = .6) => {
    const g = new IcosahedronGeometry(size, 1); g.scale(1, .7, 1);
    add("foliage", g, ["#758268", "#68795a", "#8e9878"][seed % 3], x, size * .5, z);
  };
  const tree = (x: number, z: number, seed: number, size = 1) => {
    const h = (1.1 + rand(seed) * .5) * size;
    pole(new Vector3(x, 0, z), new Vector3(x + .12, h, z), .1 * size, "#80725b");
    // Overlapping, irregular crowns read as coastal live oaks, not spherical shrubs.
    for (let i = 0; i < 6; i++) {
      const angle = i * 2.4 + seed;
      const spread = i === 0 ? 0 : .55 * size;
      const cx = x + Math.cos(angle) * spread, cz = z + Math.sin(angle) * spread;
      const cy = h + (.3 + rand(seed + i) * .45) * size;
      if (i > 0) pole(new Vector3(x, h * .6, z), new Vector3(cx, cy, cz), .035 * size, "#80725b");
      const crown = new IcosahedronGeometry((.62 + rand(seed + i + 10) * .2) * size, 1);
      crown.scale(1, .72, .9);
      crown.rotateY(angle);
      add("foliage", crown, ["#536e54", "#667c57", "#7f8d60"][i % 3], cx, cy, cz);
    }
  };
  const car = (x: number, z: number, seed: number, turn = 0) => {
    const start = Object.fromEntries(LAYERS.map(layer => [layer, parts[layer].length])) as Record<Layer, number>;
    box("architecture", ["#e5e5db", "#829d9e", "#c5c5bc", "#b67f65", "#687f8b"][seed % 5], 0, .23, 0, .46, .25, .94);
    box("glass", "#425f69", 0, .4, -.02, .36, .17, .46);
    box("architecture", "#deded0", 0, .494, -.02, .37, .025, .29);
    for (const side of [-1, 1]) {
      for (const end of [-1, 1]) box("wood", "#444d4a", side * .235, .15, end * .29, .035, .18, .18);
      box("architecture", "#eee9c9", side * .14, .27, .476, .1, .06, .025);
    }
    for (const layer of LAYERS) for (let i = start[layer]; i < parts[layer].length; i++) parts[layer][i].rotateY(turn).translate(x, 0, z);
  };
  const parkingRow = (x: number, z: number, count: number, seed: number, facing = 1, surface = "#727e7b") => {
    const pitch = .78, width = count * pitch;
    box("ground", surface, x, .053, z, width + .25, .05, 1.65);
    box("ground", "#ded8c6", x, .085, z + facing * .77, width + .25, .1, .12);
    for (let i = 0; i <= count; i++) box("ground", "#eee7d5", x - width / 2 + i * pitch, .087, z, .035, .018, 1.4);
    for (let i = 0; i < count; i++) {
      const px = x - width / 2 + (i + .5) * pitch;
      box("ground", "#c9c6b4", px, .13, z + facing * .55, .42, .075, .09);
      if (rand(seed + i) > .35) car(px, z + facing * .12, seed + i, facing < 0 ? Math.PI : 0);
    }
  };
  const windows = (x: number, z: number, w: number, d: number, h: number, stories: number) => {
    const cols = Math.max(2, Math.floor(w / .75));
    for (let floor = 0; floor < stories; floor++) for (let col = 0; col < cols; col++) {
      const px = x - w * .4 + col / (cols - 1) * w * .8, py = .5 + floor * (h / stories);
      for (const side of [-1, 1]) {
        box("architecture", "#f7f3e8", px, py, z + side * (d / 2 + .018), .37, .49, .035);
        box("glass", "#59757a", px, py, z + side * (d / 2 + .04), .25, .36, .035);
      }
    }
    for (const side of [-1, 1]) for (let floor = 0; floor < stories; floor++) {
      box("glass", "#587479", x + side * (w / 2 + .025), .5 + floor * h / stories, z, .035, .4, .32);
    }
  };
  const pool = (x: number, z: number, w: number, d: number) => {
    box("ground", "#dfd3bb", x, .025, z, w + .65, .05, d + .65);
    box("architecture", "#f5eee0", x, .075, z, w + .12, .05, d + .12);
    box("water", "#75b8bb", x, .11, z, w, .025, d);
    for (let i = 0; i < 3; i++) box("architecture", "#efede0", x - w / 2 + .2 + i * .5, .16, z + d / 2 + .3, .28, .08, .55);
  };
  const house = (x: number, z: number, seed: number, compact = false) => {
    const angle = seed % 5 === 0 ? (rand(seed + 20) > .5 ? 1 : -1) * .055 : 0;
    const w = (compact ? 1.98 + rand(seed) * .15 : 1.8 + rand(seed) * .55) - (angle ? .2 : 0);
    const d = compact ? 2.65 + rand(seed + 1) * .4 : 2 + rand(seed + 1) * .75;
    const h = compact ? (seed % 4 === 0 ? 2.65 : 1.95) : (seed % 3 === 0 ? 1.8 : 1.15);
    const colors = ["#c0d3c9", "#b3d1d0", "#e7ddc3", "#c1ccd3", "#ddc0a9", "#dce0d1"];
    box("ground", ["#9eaa86", "#adb28d", "#8d9c7b"][seed % 3], x, .012, z, w + (compact ? .15 : 1), .025, d + 1.6);
    const driveStart = z + d / 2 + .4, driveEnd = z + 3.8;
    box("ground", ["#d2ccba", "#babdb4", "#dfdccd", "#acaa97"][seed % 4], x + .25, .032, (driveStart + driveEnd) / 2, 1, .03, driveEnd - driveStart);
    const buildingStart = Object.fromEntries(LAYERS.map(layer => [layer, parts[layer].length])) as Record<Layer, number>;
    const orient = () => {
      if (!angle) return;
      for (const layer of ["architecture", "roof", "glass", "wood"] as Layer[]) {
        for (let i = buildingStart[layer]; i < parts[layer].length; i++) parts[layer][i].translate(-x, 0, -z).rotateY(angle).translate(x, 0, z);
      }
    };
    box("architecture", colors[seed % colors.length], x, h / 2 + .08, z, w, h, d);
    roof(x, h + .1, z, w + .16, d + .22, .32 + rand(seed + 3) * .38, ["#8eaaad", "#d6dcd5", "#71848a", "#b3a69a"][seed % 4], seed % 4 === 0 ? 1 : seed % 4 === 1 ? 2 : 0);
    // Keep distant silhouettes and windows; skip tiny rails and garden props.
    if (z < -38 || z > 40) {
      for (let floor = 0; floor < 2; floor++) for (const side of [-1, 1]) box("glass", "#607c80", x + side * w * .28, .55 + floor * .9, z + d / 2 + .022, .34, .42, .035);
      box("architecture", "#e7e6d7", x, 1.14, z + d / 2 + .25, w, .07, .65);
      orient();
      return;
    }
    windows(x, z, w, d, h, h > 2.5 ? 3 : h > 1.5 ? 2 : 1);
    // White corner boards and horizontal floor trim distinguish adjacent facades.
    for (const side of [-1, 1]) box("architecture", "#f2edde", x + side * (w / 2 - .035), h / 2 + .08, z + d / 2 + .018, .07, h, .05);
    if (h > 1.5) box("architecture", "#e7e8d9", x, 1.12, z + d / 2 + .035, w, .065, .065);
    // A shaded front porch with posts, a light deck and a blue-gray door.
    box("wood", "#d8d0b9", x, .18, z + d / 2 + .32, w * .9, .12, .75);
    box("glass", "#657f7e", x, .49, z + d / 2 + .025, .36, .65, .04);
    for (const side of [-1, 1]) box("architecture", "#f4eee0", x + side * w * .4, .65, z + d / 2 + .6, .07, .96, .07);
    box("architecture", "#f2ecdc", x, 1.12, z + d / 2 + .37, w, .08, .8);
    if (compact) {
      // Upper porch rail, shutters, entry steps and small front gardens on tight lots.
      box("architecture", "#e9e7d9", x, 1.55, z + d / 2 + .7, w * .92, .045, .045);
      for (let i = 0; i < 7; i++) box("architecture", "#eeeadd", x - w * .43 + i * w * .86 / 6, 1.34, z + d / 2 + .7, .035, .4, .035);
      for (const side of [-1, 1]) box("wood", "#78928e", x + side * w * .28, 1.48, z + d / 2 + .04, .1, .47, .035);
      box("wood", "#d4cbb5", x, .1, z + d / 2 + .88, .65, .14, .35);
      if (seed % 3 === 0) {
        // Segmented garage door, on selected homes only.
        box("architecture", "#bbc8bd", x + .15, .5, z + d / 2 + .07, 1.13, .78, .06);
        for (let i = 0; i < 5; i++) box("architecture", "#d4dbcd", x + .15, .19 + i * .15, z + d / 2 + .105, 1.1, .02, .015);
      } else if (seed % 3 === 1) {
        // Exterior stair to the upper porch, tucked inside the front yard.
        for (let i = 0; i < 8; i++) box("wood", "#c3bba6", x - w * .28, .09 + i * .067, z + d / 2 + 1.95 - i * .16, .48, .18 + i * .134, .17);
        pole(new Vector3(x - w * .28 - .26, .4, z + d / 2 + 2), new Vector3(x - w * .28 - .26, 1.42, z + d / 2 + .72), .022, "#eee8d7");
        box("glass", "#67817e", x - w * .28, 1.48, z + d / 2 + .065, .33, .62, .035);
      }
      if (seed % 4 === 2) {
        const awning = new BoxGeometry(w * .7, .055, .5).rotateX(-.18);
        add("roof", awning, "#748f89", x, h - .12, z + d / 2 + .2);
      }
      orient();
      bush(x - w * .36, z + d / 2 + 1.2, seed, .24);
      if (seed % 3 === 0) palm(x + w * .38, z + d / 2 + 1.2, seed, true);
      if (seed % 4 === 0) car(x + .37, z + d / 2 + 1.7, seed);
    } else {
      orient();
      if (seed % 4 === 0) pool(x + w / 2 + .65, z - .3, .75, 1.3);
      palm(x - w / 2 - .45, z + d / 2, seed, true);
      bush(x + w / 2 + .3, z + .8, seed);
    }
  };

  const flatRoof = (x: number, z: number, w: number, d: number, h: number, seed: number) => {
    box("roof", "#a8a99a", x, h + .04, z, w, .1, d);
    for (const side of [-1, 1]) {
      box("architecture", "#d8d5bf", x + side * (w / 2 - .065), h + .18, z, .13, .3, d);
      box("architecture", "#d8d5bf", x, h + .18, z + side * (d / 2 - .065), w, .3, .13);
    }
    for (let i = 0; i < 3; i++) {
      const px = x - w * .3 + i * w * .3, pz = z - d * .1;
      box("roof", "#91978b", px + .18, h + .102, pz + .15, .95, .015, .83);
      box("architecture", "#c4c8bc", px, h + .27, pz, .56, .34, .62);
      add("wood", new CylinderGeometry(.17, .17, .025, 10), "#616e69", px, h + .455, pz);
      for (let j = 0; j < 4; j++) box("wood", "#8b9589", px - .13 + j * .085, h + .475, pz, .024, .025, .29);
      box("roof", "#989b8d", x + (rand(seed + i) - .5) * w * .7, h + .101, z + d * .25, .45 + rand(seed + i + 3), .01, .3);
    }
  };
  const apartment = (x: number, z: number, seed: number) => {
    const w = 4.2, d = 3, h = 2.95;
    box("ground", "#a8af90", x, .025, z, 4.55, .05, 5.8);
    box("architecture", seed % 2 ? "#c8d5ce" : "#ddd5bd", x, h / 2, z, w, h, d);
    windows(x, z, w, d, h, 3);
    flatRoof(x, z, w, d, h, seed);
    for (const y of [1.05, 2.05]) {
      box("architecture", "#e8e4d4", x, y, z + 1.65, w, .085, .48);
      box("wood", "#8a9a8c", x, y + .28, z + 1.87, w, .04, .035);
      for (let i = 0; i < 15; i++) box("wood", "#8a9a8c", x - 2 + i * .285, y + .15, z + 1.87, .025, .27, .025);
    }
    for (const px of [x - 1.9, x + 1.9]) box("architecture", "#e5e0cd", px, 1.03, z + 1.84, .075, 2.05, .075);
    box("ground", "#cecbbb", x, .035, z + 2.8, 1.3, .04, 1.9);
  };
  const commercial = (x: number, z: number, seed: number, hotel = false) => {
    const w = 8.6, d = 3.5, h = hotel ? 3.3 : 1.35;
    const surface = seed % 2 ? "#555f60" : "#bbbdb2";
    box("ground", surface, x, .025, z + 1, 10, .05, 9);
    box("architecture", hotel ? "#dbd9c3" : "#d5c9ae", x, h / 2, z - .6, w, h, d);
    flatRoof(x, z - .6, w, d, h, seed);
    if (hotel) windows(x, z - .6, w, d, h, 3);
    else for (let i = 0; i < 5; i++) {
      const px = x - 3.35 + i * 1.67;
      box("glass", "#627f7c", px, .57, z + 1.17, 1.35, .8, .04);
      box("architecture", "#e6dec9", px, .55, z + 1.2, .055, 1, .06);
      const shade = new BoxGeometry(1.45, .06, .65).rotateX(-.14);
      add("roof", shade, ["#758b83", "#9e8773", "#829692"][i % 3], px, 1.1, z + 1.42);
    }
    box("ground", "#d1c8b3", x, .105, z + 1.7, w + .4, .12, .65);
    for (let i = 0; i < 5; i++) box("architecture", "#b5b29c", x - 3.7 + i * 1.8, .13, z + 1.18, .22 + rand(seed + i) * .3, .22, .04);
    parkingRow(x, z + 4.1, 11, seed, 1, surface);
    box("ground", surface, x + 4.45, .04, z + 5.5, 1.05, .055, 3.7);
    for (let i = 0; i < 3; i++) box("ground", seed % 2 ? "#64706b" : "#a5ad9e", x - 2 + i * 2.2, .06, z + 2.65, .7, .012, .45, .1 * i);
    palm(x - 4.4, z + 3.1, seed);
  };
  const lamp = (x: number, z: number, side: number) => {
    box("wood", "#69766e", x, .13, z, .15, .24, .15);
    pole(new Vector3(x, .15, z), new Vector3(x, 2.45, z), .035, "#65766f");
    pole(new Vector3(x, 2.4, z), new Vector3(x + side * .45, 2.55, z), .026, "#65766f");
    box("wood", "#566a66", x + side * .45, 2.53, z, .3, .09, .15);
    box("architecture", "#eee7c8", x + side * .45, 2.478, z, .23, .025, .11);
  };

  // A1A extends through the whole visible town, including the distant blocks.
  box("ground", "#d0c6b1", -6.7, .016, -32, 3.2, .04, 200);
  box("ground", "#798382", -6.7, .048, -32, 2.25, .035, 200);
  const roadEnds = [-132, ...CROSS_STREETS, 68];
  for (let i = 0; i < roadEnds.length - 1; i++) {
    const a = roadEnds[i] + 1.35, b = roadEnds[i + 1] - 1.35;
    for (const x of [-6.77, -6.63]) box("ground", "#dfcea0", x, .074, (a + b) / 2, .035, .012, b - a);
    for (const x of [-7.68, -5.72]) box("ground", "#dcdccb", x, .074, (a + b) / 2, .025, .012, b - a);
  }
  box("ground", "#85898a", -22, .035, -32, 1.5, .035, 200);
  for (const z of CROSS_STREETS) {
    // Stop paved streets at the dune edge; timber continues across the sand.
    box("ground", "#d6ccbb", -11.5, .024, z, 35, .035, 1.8);
    box("ground", "#969b98", -11.5, .047, z, 35, .025, 1.25);
    for (let i = 0; i < 6; i++) box("ground", "#ebe6d7", -7.6 + i * .35, .075, z + .82, .18, .01, .52);
    for (const side of [-1, 1]) box("ground", "#ebe6d7", -6.7 + side * .53, .079, z + side * 1.32, .9, .012, .065);
    // Raised, switchback beach access with simple timber handrails.
    const route = [new Vector3(6, .28, z), new Vector3(8.5, .6, z), new Vector3(9.7, .6, z + .8), new Vector3(12, .16, z + .8)];
    for (let i = 0; i < route.length - 1; i++) {
      const a = route[i], b = route[i + 1], delta = b.clone().sub(a);
      const deck = new BoxGeometry(delta.length() + .06, .075, .5);
      deck.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), delta.clone().normalize()));
      add("wood", deck, "#b6a28a", (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
      for (const side of [-1, 1]) {
        const offset = new Vector3(-delta.z, 0, delta.x).normalize().multiplyScalar(.23 * side);
        const aa = a.clone().add(offset), bb = b.clone().add(offset);
        pole(aa, aa.clone().add(new Vector3(0, .4, 0)), .024, "#e0d6c2");
        pole(bb, bb.clone().add(new Vector3(0, .4, 0)), .024, "#e0d6c2");
        pole(aa.clone().add(new Vector3(0, .38, 0)), bb.clone().add(new Vector3(0, .38, 0)), .025, "#dfd1b6");
      }
    }
    lamp(-8.05, z + 2.5, 1);
    lamp(-5.25, z - 2.5, -1);
  }
  // Beach homes sit almost shoulder to shoulder: narrow side yards, deeper lots.
  // Rows leave the cross streets open and keep driveways out of the next house.
  const accessLane = (z: number, west = false) => {
    box("ground", "#b5b8a8", west ? -14.35 : -.5, .035, z + 3.8, west ? 15.3 : 12.4, .03, .48);
  };
  const beachRows = [-32, -25.5, -16.2, -10, 14, 20.5, 29.5, 36];
  beachRows.forEach((z, row) => {
    accessLane(z);
    if (row === 3 || row === 4) apartment(-1.975, z, row + 700);
    [-3.15, -.8, 1.55, 3.9].forEach((x, col) => {
      if ((row === 3 || row === 4) && col < 2) return;
      house(x, z, row * 4 + col + 1, true);
    });
  });
  house(4.8, -.6, 35, true);
  house(4.8, 5.7, 36, true);
  [-25, -16, -10, 14, 20.5, 30, 36].forEach((z, row) => {
    accessLane(z, true);
    [-18.6, -16.15, -13.7, -11.25].forEach((x, col) => house(x, z, 50 + row * 4 + col, true));
    tree(-20.5, z - .4, row + 30, .85);
  });
  [[-26,4],[-26,17],[-26,-25]].forEach(([x,z],i)=>house(x,z,i+90));

  // Continue the coast into the distance with a mixture of homes and commerce.
  // Far homes deliberately omit small balcony hardware to keep the hero light.
  const extendedRows = [-120, -113.5, -105, -98.5, -90, -83.5, -75, -68.5, -60, -53.5, -45];
  extendedRows.forEach((z, row) => {
    accessLane(z);
    [-3.15, -.8, 1.55, 3.9].forEach((x, col) => house(x, z, 300 + row * 4 + col, true));
    if (z !== -75 && z !== -68.5 && z !== -45) {
      accessLane(z, true);
      [-18.6, -16.15, -13.7, -11.25].forEach((x, col) => house(x, z, 500 + row * 4 + col, true));
    }
    tree(-20.4, z - .5, 600 + row, .8);
    palm(5.55, z + .3, 700 + row);
  });
  commercial(-14.3, -72, 801, true);
  commercial(-14.3, -45.5, 802);

  // The pale coastal home from the reference, with its separate light-roof garage.
  // A visual likeness only; no address, map marker, or personal label.
  box("ground", "#cec8b2", -26.3, .025, -10.4, 4.8, .04, 5.7);
  box("architecture", "#bfd5cd", -26.8, 1.03, -11.2, 2.5, 1.98, 2.8);
  roof(-26.8, 2.06, -11.2, 2.75, 3.05, .58, "#d2ddd9");
  windows(-26.8, -11.2, 2.5, 2.8, 1.98, 2);
  box("wood", "#d9d1ba", -26.8, .19, -9.35, 2.65, .15, .95);
  roof(-26.8, 1.1, -9.35, 2.75, 1.1, .22, "#c9d6d0");
  for (const x of [-27.9, -26.8, -25.7]) box("architecture", "#f3eedf", x, .63, -8.97, .065, .95, .065);
  box("architecture", "#e4e5d6", -24.4, .58, -11.1, 1.45, 1.1, 2.6);
  roof(-24.4, 1.15, -11.1, 1.6, 2.75, .35, "#d4ded8");
  box("architecture", "#a7b7b0", -24.4, .51, -9.78, 1.13, .83, .04);
  for (let i = 0; i < 5; i++) box("architecture", "#c2ccc2", -24.4, .22 + i * .15, -9.75, 1.13, .025, .025);
  palm(-28.5, -9.1, 901);
  tree(-28.7, -12.4, 902, .9);

  // Best Western Seaside Inn: long terracotta roof, cream arcade, pool and parking.
  box("ground", "#828987", -14, .025, 3, 10.5, .05, 11);
  box("architecture", "#ebdfc5", -14.8, 1, 3, 7.3, 1.9, 3.4);
  roof(-14.8, 2, 3, 7.7, 3.8, .9, "#c47f60");
  box("architecture", "#e8dcc4", -11.7, 1.1, .6, 2, 2.1, 3.4);
  roof(-11.7, 2.2, .6, 2.3, 3.7, .7, "#cb8665");
  windows(-14.8,3,7.3,3.4,1.9,2);
  for(let i=0;i<10;i++) {
    box("architecture", "#f5ebd7", -18 + i * .7, .62, 5, .09, 1.2, .15);
    if(i%2===0) palm(-18+i*.8,-2,i+20);
  }
  box("architecture", "#f4e9d6", -14.8,1.23,5,7.3,.12,.6);
  // Front arcade, upper balcony and small projecting roof pavilions.
  box("architecture", "#e9d8b9", -14.8, 1.96, 5, 7.3, .14, .62);
  box("architecture", "#eee4ce", -14.8, 1.53, 5.27, 7.3, .06, .045);
  for (let i = 0; i < 30; i++) box("architecture", "#e8dcc1", -18.3 + i * .24, 1.4, 5.27, .03, .26, .035);
  for(const x of [-16.8,-14.5]) {
    box("architecture", "#f0e3c9", x, 2.62, 3.9, .82, .5, .65);
    roof(x,2.86,3.9,1.05,.9,.3,"#c98261");
    box("glass", "#677d78", x, 2.63, 4.24, .36, .28, .025);
  }
  for (const x of [-18.1, -11.6]) {
    box("architecture", "#e9d9bc", x, 1.15, 4.85, .9, 2.15, 1);
    roof(x, 2.25, 4.85, 1.25, 1.35, .48, "#c98261");
  }
  // Fine roof ridges catch the sun without using a large texture asset.
  for (let i = 0; i < 29; i++) {
    const x = -17.7 + i * .21;
    const rise = Math.min(.9, (3.85 - Math.abs(x + 14.8)) * .9 / 1.9);
    pole(new Vector3(x, 2.015, 4.9), new Vector3(x, 2 + rise, 3), .014, "#b87859", "roof");
  }
  parkingRow(-14.9, 7.15, 10, 150);
  parkingRow(-15.9, -.5, 7, 170, -1);
  tree(-19.1, 7.6, 180, .7);
  tree(-19.1, -1.5, 181, .7);
  pool(-10.8,5.7,1.65,2);

  // Castillo-inspired beachside hotel with roof terraces and a courtyard pool.
  box("ground", "#c4b9a0", -.9,.025,-1,8.2,.05,8.3);
  box("architecture", "#e9e2c8", -1.8,1.65,-1.3,4,3.3,4.1);
  box("architecture", "#f0e7cf", .8,1.3,-2.5,1.4,2.6,3.5);
  roof(-1.8,3.3,-1.3,4.3,4.4,.34,"#ad9d87");
  windows(-1.8,-1.3,4,4.1,3.3,3);
  for (const level of [1.12, 2.22, 3.2]) {
    box("architecture", "#d9c9ac", -1.8, level, .82, 4.25, .09, .25);
    if (level < 3) {
      box("wood", "#8b9687", -1.8, level + .26, .96, 3.85, .035, .035);
      for (let i = 0; i < 17; i++) box("wood", "#8b9687", -3.7 + i * .24, level + .15, .96, .025, .24, .025);
    }
  }
  for(const x of [-3.6,.05]) for(const z of [-3.2,.6]){
    box("architecture","#eee5cd",x,3.2,z,.7,.6,.7);
    roof(x,3.55,z,.9,.9,.35,"#ba8067");
  }
  pool(1.2,1.2,1.5,2.7);
  [0,1,2,3].forEach(i=>palm(3.1,-3+i*1.9,i+40));
  box("ground", "#838a81", -1.7, .045, 5, 5.4, .05, 4);
  parkingRow(-1.7, 5.95, 6, 190);
  for (const x of [-4.25, .8]) {
    box("ground", "#b4b59b", x, .11, 6, .45, .16, 1.9);
    bush(x, 6, 50, .35);
  }

  // A modest white hotel further along the boulevard.
  box("ground","#929993",-14,.025,-32,10,.05,8);
  box("architecture","#e7e8dc",-14,1.75,-32,7.2,3.5,3.5);
  flatRoof(-14,-32,7.2,3.5,3.5,860);
  windows(-14,-32,7.2,3.5,3.5,3);
  for (const y of [1.15, 2.3, 3.5]) box("architecture", "#d4dbcb", -14, y, -30.15, 7.45, .085, .24);
  parkingRow(-14, -29.15, 11, 220);
  parkingRow(-14, -35, 11, 240, -1);
  pool(-9.8,-32,1.2,2.4);

  // Gardens, roadside palms, and dune scrub; no moving land or camera wobble.
  for(let i=0;i<48;i++){
    const z=-126+i*3.7;
    if(CROSS_STREETS.every(s=>Math.abs(z-s)>1.6)) palm(-8.8,z,i+100);
    for(let j=0;j<3;j++)bush(6.3+rand(i*4+j)*2.6,z+rand(i+7+j),i+j,.22+rand(i+j+1)*.3);
  }
  for(let i=0;i<50;i++){
    const x=-32+rand(i+400)*2.8,z=-125+i*3.2;
    tree(x,z,i+300,.8+rand(i)*.4);
  }
  for (const z of [-35, -21.5, -7.1, 11.6, 26.5, 40]) {
    tree(-4.25, z, Math.round(z + 100), .65);
    palm(5.6, z, z + 400);
  }
  return Object.fromEntries(LAYERS.map(layer=>{
    const geometry=mergeGeometries(parts[layer]);
    parts[layer].forEach(g=>g.dispose());
    if(!geometry)throw new Error(`Unable to build coastal ${layer}`);
    geometry.computeBoundingSphere();
    return [layer,geometry];
  })) as CoastalTown;
}
