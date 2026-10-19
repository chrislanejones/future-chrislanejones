import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry,
  IcosahedronGeometry, Matrix4, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { accessCenter, CROSS_STREETS, duneAccessDistance, duneCoverage, duneHeight } from "./coast-terrain";
import { buildCastilloReal } from "./castillo-real";
import { addBestWesternDetails } from "./best-western-detail";
import { buildBeachLandmarkHouses } from "./beach-landmark-houses";
import { addCoastalVisitors, buildCoastFacingHomes } from "./coastal-street-life";
import { buildTenthStreetBlock } from "./tenth-street-block";

// An original, simplified model guided by Chris's St Augustine Beach photos.
// Positions and building dimensions are compositional, not surveyed map data.
// X points toward the sea; Z follows A1A. No map tiles or remote assets are used.
type Layer = "architecture" | "roof" | "glass" | "ground" | "foliage" | "wood" | "water";
const LAYERS: Layer[] = ["architecture", "roof", "glass", "ground", "foliage", "wood", "water"];
export type CoastalTown = Record<Layer, BufferGeometry>;
const rand = (seed: number) => { const v = Math.sin(seed * 127.1 + 31.7) * 43758.5453; return v - Math.floor(v); };

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
    // Crown size and trunk height are independent: tall palms keep airy silhouettes.
    const h = small ? 1 + rand(seed) * 1.1 : 2.4 + rand(seed) * 3.1;
    const lean = .1 + rand(seed + 3) * .38, heading = rand(seed + 4) * Math.PI * 2;
    const top = new Vector3(x + Math.cos(heading) * lean, h, z + Math.sin(heading) * lean);
    const mid = new Vector3(x + Math.cos(heading) * lean * .24, h * .53, z + Math.sin(heading) * lean * .24);
    const radius = small ? .065 : .065 + rand(seed + 7) * .04;
    pole(new Vector3(x, .02, z), mid, radius * 1.15, "#94826a");
    pole(mid, top, radius, "#a39173");
    if (rand(seed + 11) > .45) for (let ring = 0; ring < 5; ring++) {
      add("wood", new CylinderGeometry(radius * 1.3, radius * 1.65, .08, 7), "#84765c",
        top.x - Math.cos(heading) * lean * ring * .025, h - .16 - ring * .13, top.z - Math.sin(heading) * lean * ring * .025);
    }
    const crown = (small ? .67 : 1.06) * (.76 + rand(seed + 12) * .58);
    for (let n = 0; n < 12; n++) {
      const angle = n * Math.PI * 2 / 12 + seed + rand(seed + n * 13) * .23;
      const length = crown * (.78 + rand(seed + n) * .43);
      const old = n > 9, droop = old ? .9 : .4 + rand(seed + n + 25) * .36;
      const verts: number[] = [];
      for (let j = 0; j < 6; j++) {
        const point = (v: number, side: number) => {
          const width = Math.sin(v * Math.PI) * crown * .21 * (1 + Math.sin(v * 35) * .14);
          return [top.x + Math.cos(angle) * v * length + Math.sin(angle) * width * side,
            top.y + Math.sin(v * Math.PI) * (old ? .07 : .35) - v * v * droop,
            top.z + Math.sin(angle) * v * length - Math.cos(angle) * width * side];
        };
        const t = j / 6, u = (j + 1) / 6;
        verts.push(...point(t, -1), ...point(u, -1), ...point(t, 1), ...point(t, 1), ...point(u, -1), ...point(u, 1));
      }
      const g = new BufferGeometry(); g.setAttribute("position", new BufferAttribute(new Float32Array(verts), 3)); g.computeVertexNormals();
      add("foliage", g, old ? "#777c4e" : ["#426b4d", "#71854f", "#8a985d"][n % 3], 0, 0, 0);
    }
  };
  const bush = (x: number, z: number, seed: number, size = .6) => {
    const g = new IcosahedronGeometry(size, 1); g.scale(1, .7, 1);
    add("foliage", g, ["#758268", "#68795a", "#8e9878"][seed % 3], x, size * .5, z);
  };
  const tree = (x: number, z: number, seed: number, size = 1) => {
    const upright = rand(seed + 91) > .78;
    const trunkHeight = (1.25 + rand(seed) * .65) * size;
    const spread = (upright ? .77 : 1.23 + rand(seed + 2) * .38) * size;
    const lean = new Vector3((rand(seed + 4) - .5) * .48 * size, 0, (rand(seed + 5) - .5) * .48 * size);
    const fork = new Vector3(x + lean.x, trunkHeight * .56, z + lean.z);
    add("wood", new CylinderGeometry(.14 * size, .24 * size, .28 * size, 7), "#796f59", x, .14 * size, z);
    pole(new Vector3(x, .1, z), fork, .145 * size, "#817760");
    // Low fork, substantial arching limbs, and irregular lobe clusters leave real sky gaps.
    const crownPalette = ["#3f6148", "#4c6c4c", "#617b50", "#70845b", "#536d49"];
    for (let limb = 0; limb < 5; limb++) {
      const angle = seed + limb * 2.4 + rand(seed + limb * 37) * .48;
      const reach = spread * (.67 + rand(seed + limb * 19) * .4);
      const joint = new Vector3(x + Math.cos(angle) * reach * .52, trunkHeight * .95, z + Math.sin(angle) * reach * .52);
      const tip = new Vector3(x + Math.cos(angle) * reach, trunkHeight + (.45 + rand(seed + limb) * .48) * size, z + Math.sin(angle) * reach);
      if (upright) tip.y += .6 * size;
      pole(fork, joint, .08 * size, "#867b62");
      pole(joint, tip, .046 * size, "#8e8167");
      for (let lobe = 0; lobe < 3; lobe++) {
        const ls = seed + limb * 127 + lobe * 17;
        const lx = tip.x + (rand(ls + 12) - .5) * size * 1.03;
        const lz = tip.z + (rand(ls + 13) - .5) * size * 1.03;
        const ly = tip.y + (rand(ls + 14) - .3) * .53 * size;
        const crown = new IcosahedronGeometry((.49 + rand(ls + 21) * .28) * size, 1);
        const positions = crown.getAttribute("position");
        for (let i = 0; i < positions.count; i++) {
          const px = positions.getX(i), py = positions.getY(i), pz = positions.getZ(i);
          const uneven = 1 + .13 * Math.sin(px * 9 + seed) * Math.sin(pz * 8 + py * 6);
          positions.setXYZ(i, px * uneven, py * uneven, pz * uneven);
        }
        crown.scale(upright ? .95 : 1.25, upright ? 1.04 : .72, 1.07);
        crown.rotateY(angle + lobe); crown.computeVertexNormals();
        add("foliage", crown, crownPalette[Math.floor(rand(ls + 44) * crownPalette.length)], lx, ly, lz);
      }
    }
    // A small off-center top cluster joins the limbs without erasing their openings.
    const top = new IcosahedronGeometry(.72 * size, 1); top.scale(1.15, upright ? 1.2 : .75, 1);
    add("foliage", top, "#58754d", x + lean.x, trunkHeight + .82 * size, z + lean.z);
  };
  const car = (x: number, z: number, seed: number, turn = 0) => {
    const start = Object.fromEntries(LAYERS.map(layer => [layer, parts[layer].length])) as Record<Layer, number>;
    const family = Math.floor(rand(seed + 503) * 4);
    const color = ["#e5e5db", "#829d9e", "#c5c5bc", "#b67f65", "#687f8b", "#3e4d54", "#ede4cc"][seed % 7];
    const length = family === 2 ? 1.08 : family === 3 ? .83 : .94;
    const roofHeight = family === 1 ? .58 : .5;
    box("architecture", color, 0, .23, 0, .46, .25, length);
    box("glass", "#344e57", 0, .4, family === 2 ? .13 : -.02, .36, roofHeight - .32, family === 2 ? .35 : family === 1 ? .61 : .46);
    box("architecture", color, 0, roofHeight, family === 2 ? .13 : -.02, .38, .035, family === 2 ? .26 : family === 1 ? .49 : .29);
    if (family === 2) box("wood", "#56605b", 0, .365, -.3, .37, .025, .36);
    for (const side of [-1, 1]) {
      for (const end of [-1, 1]) box("wood", "#343c39", side * .235, .15, end * length * .3, .035, .18, .18);
      box("architecture", "#eee9c9", side * .14, .27, length / 2 + .013, .1, .06, .025);
      box("architecture", "#b26954", side * .16, .27, -length / 2 - .013, .07, .06, .025);
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
      if (rand(seed + i) > .64) car(px, z + facing * .12, seed + i, facing < 0 ? Math.PI : 0);
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
    const angle = seed % 3 === 0 ? (rand(seed + 20) - .5) * .16 : 0;
    const family = Math.floor(rand(seed + 817) * 7);
    const w = (compact ? 1.98 + rand(seed) * .15 : 1.8 + rand(seed) * .55) - (angle ? .2 : 0);
    const d = compact ? 2.65 + rand(seed + 1) * .4 : 2 + rand(seed + 1) * .75;
    const h = family === 2 ? 1.22 : compact ? (seed % 4 === 0 ? 2.65 : 1.95) : (seed % 3 === 0 ? 1.8 : 1.15);
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
    if (family === 4) {
      box("roof", "#c4c7ba", x, h + .13, z, w + .12, .14, d + .16);
      for (const side of [-1, 1]) box("architecture", "#eeeadb", x + side * w / 2, h + .24, z, .08, .25, d);
      box("architecture", "#a7b5b0", x + w * .2, h + .34, z - .5, .45, .3, .55);
    } else {
      roof(x, h + .1, z, w + .16, d + .22, family === 2 ? 1.35 : .32 + rand(seed + 3) * .38,
        ["#8eaaad", "#d6dcd5", "#71848a", "#b3a69a"][seed % 4], family === 2 ? 1 : seed % 4 === 0 ? 1 : seed % 4 === 1 ? 2 : 0);
    }
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

  type InlandRoad = { ax: number; az: number; bx: number; bz: number; width: number };
  const inlandRoads: InlandRoad[] = [];
  const inlandPlots: { x: number; z: number; radius: number }[] = [];
  const localRoad = (ax: number, az: number, bx: number, bz: number, width = 1.65) => {
    const length = Math.hypot(bx - ax, bz - az), angle = Math.atan2(bx - ax, bz - az);
    box("ground", "#a4a895", (ax + bx) / 2, .025, (az + bz) / 2, width + .34, .025, length + .16, angle);
    box("ground", "#818985", (ax + bx) / 2, .052, (az + bz) / 2, width, .028, length + .07, angle);
    inlandRoads.push({ ax, az, bx, bz, width });
  };
  const nearestRoad = (x: number, z: number) => {
    let closest = { x: 0, z: 0, distance: Infinity, width: 0 };
    for (const road of inlandRoads) {
      const dx = road.bx - road.ax, dz = road.bz - road.az;
      const t = Math.max(0, Math.min(1, ((x - road.ax) * dx + (z - road.az) * dz) / (dx * dx + dz * dz)));
      const px = road.ax + t * dx, pz = road.az + t * dz, distance = Math.hypot(x - px, z - pz);
      if (distance < closest.distance) closest = { x: px, z: pz, distance, width: road.width };
    }
    return closest;
  };
  const inlandHome = (x: number, z: number, seed: number, streetX: number, streetZ: number) => {
    const start = Object.fromEntries(LAYERS.map(layer => [layer, parts[layer].length])) as Record<Layer, number>;
    const family = Math.floor(rand(seed + 402) * 6), tall = family === 2;
    const w = 2.6 + rand(seed + 4) * 1.05, d = 2.55 + rand(seed + 5) * .75;
    const h = tall ? 2.5 : family === 4 ? 1.02 : 1.2 + rand(seed + 6) * .28;
    const front = Math.hypot(streetX - x, streetZ - z) - .68;
    const angle = (rand(seed + 11) - .5) * .15;
    const color = ["#c0cdba", "#a9c7c4", "#d2d3be", "#dbc6ac", "#b4bec2", "#e3d9bd", "#bec6a3"][seed % 7];
    const roofColor = ["#a1b4b1", "#ced6cd", "#7c8986", "#8b8e82", "#b2a18a"][Math.floor(rand(seed + 50) * 5)];
    const lawn = ["#96a77b", "#a3ad85", "#819b75", "#a8ad83"][Math.floor(rand(seed + 61) * 4)];
    box("ground", lawn, 0, .016, (front - 2.5) / 2, 5.9, .025, front + 2.5);
    const buildingStart = Object.fromEntries(LAYERS.map(layer => [layer, parts[layer].length])) as Record<Layer, number>;
    box("architecture", color, 0, h / 2 + .06, 0, w, h, d);
    if (family === 3) {
      box("roof", "#b4b8a8", 0, h + .13, 0, w + .24, .12, d + .2);
      box("architecture", color, -w * .37, .54, d * .43, 1.4, .96, 1.8);
      box("roof", "#bdc3b4", -w * .37, 1.1, d * .43, 1.55, .1, 1.96);
      box("architecture", "#e3dcc7", 0, h + .2, -d / 2, w, .16, .09);
    } else {
      roof(0, h + .09, 0, w + .2, d + .24, family === 4 ? 1.43 : .45 + rand(seed + 31) * .27, roofColor, family === 0 || family === 4 ? 1 : family === 5 ? 2 : 0);
    }
    const stories = tall ? 2 : 1, columns = tall ? 3 : 2;
    for (let floor = 0; floor < stories; floor++) for (let col = 0; col < columns; col++) {
      const px = -w * .32 + col / (columns - 1) * w * .64, py = .64 + floor * 1.18;
      for (const side of [-1, 1]) {
        if (side === 1 && family === 3 && px < 0) continue;
        box("architecture", "#eee9d9", px, py, side * (d / 2 + .023), .6, .59, .055);
        box("glass", "#547471", px, py, side * (d / 2 + .057), .45, .45, .025);
        if (seed % 4 === 0) for (const edge of [-1, 1]) box("wood", "#71887a", px + edge * .38, py, side * (d / 2 + .045), .12, .59, .035);
      }
    }
    for (const side of [-1, 1]) for (const pz of [-d * .28, d * .29]) {
      box("architecture", "#e8e7d9", side * (w / 2 + .018), .68, pz, .04, .55, .47);
      box("glass", "#62817d", side * (w / 2 + .043), .68, pz, .018, .42, .34);
    }
    const porchX = family === 3 ? w * .22 : -.2, porchWidth = tall ? w * .94 : w * .6;
    box("wood", "#c5baa0", porchX, .17, d / 2 + .38, porchWidth, .13, .88);
    box("architecture", "#e8e2d0", porchX, 1.2, d / 2 + .37, porchWidth + .18, .07, 1.0);
    for (const side of [-1, 1]) box("architecture", "#e7e2d0", porchX + side * (porchWidth / 2 - .08), .7, d / 2 + .75, .075, 1.05, .075);
    box("glass", "#637d79", porchX, .58, d / 2 + .065, .38, .81, .04);
    for (let step = 0; step < 3; step++) box("wood", "#c9c0a7", porchX, .035 + step * .04, d / 2 + 1.11 - step * .13, .64, .07 + step * .08, .15);
    if (tall) {
      box("architecture", "#ece6d6", 0, 1.62, d / 2 + .78, w * .93, .045, .045);
      for (let rail = 0; rail < 10; rail++) box("wood", "#d5d9c7", -w * .43 + rail * w * .086, 1.42, d / 2 + .78, .032, .4, .03);
      box("architecture", "#e0dece", 0, 2.5, d / 2 + .34, w + .12, .09, 1.01);
      for (const side of [-1, 1]) box("architecture", "#e8e3d2", side * w * .44, 1.91, d / 2 + .74, .065, 1.2, .065);
    }
    const garage = family === 0 || family === 1;
    const driveX = garage ? 1.3 : family === 5 ? 1.95 : .95;
    if (garage) {
      box("architecture", color, 1.18, .61, .64, 1.75, 1.1, d);
      roof(1.18, 1.21, .64, 1.94, d + .16, .38, roofColor, family === 0 ? 1 : 0);
      box("architecture", "#bcc8b5", 1.18, .55, .64 + d / 2 + .035, 1.39, .88, .055);
      for (let slat = 0; slat < 5; slat++) box("architecture", "#d0d5c3", 1.18, .2 + slat * .16, .64 + d / 2 + .069, 1.38, .02, .018);
    } else if (family === 5) {
      box("roof", "#b8c3b6", 1.96, 1.25, .5, 1.35, .065, 2.9);
      for (const px of [1.42, 2.5]) for (const pz of [-.83, 1.82]) box("wood", "#dad4bf", px, .64, pz, .07, 1.23, .07);
    }
    if (family === 3) {
      for (const px of [-1.85, -.15]) for (const pz of [-2.5, -1.6]) pole(new Vector3(px, 0, pz), new Vector3(px, 1.35, pz), .04, "#a49476");
      for (let beam = 0; beam < 7; beam++) box("wood", "#b1a185", -1.85 + beam * .29, 1.4, -2.05, .055, .07, 1.25);
    }
    if (seed % 11 === 0 && family !== 4) for (let panel = 0; panel < 3; panel++) {
      const solar = new BoxGeometry(.55, .03, .72).rotateX(-.18);
      add("glass", solar, "#47616b", -.7 + panel * .57, h + .49, .4);
    }
    for (const layer of LAYERS) for (let i = buildingStart[layer]; i < parts[layer].length; i++) parts[layer][i].rotateY(angle);
    const driveBegin = garage ? d / 2 + .6 : .5;
    box("ground", ["#c7c5b2", "#d8d0ba", "#afb3a3"][seed % 3], driveX, .046, (driveBegin + front) / 2, 1.4, .035, Math.max(.3, front - driveBegin));
    if (seed % 5 === 0) for (let joint = 0; joint < 4; joint++) box("ground", "#a8aa99", driveX, .066, driveBegin + joint * (front - driveBegin) / 4, 1.39, .007, .02);
    if (rand(seed + 707) > .57) car(driveX, garage ? front - .65 : 1.1, seed + 2300, Math.PI);
    if (rand(seed + 213) > .25) {
      pole(new Vector3(-1.45, 0, front - .2), new Vector3(-1.45, .4, front - .2), .025, "#a6a28b");
      box("wood", "#647970", -1.45, .45, front - .2, .22, .14, .16);
    }
    for (let shrub = 0; shrub < 3; shrub++) bush(-1.25 + shrub * .62, d / 2 + .94, seed + shrub, .22 + rand(seed + shrub) * .12);
    if (rand(seed + 334) > .24) tree(-2.65, -.8 + rand(seed + 338) * 1.4, seed + 9901, 1.1 + rand(seed + 335) * .78);
    if (rand(seed + 336) > .58) tree(2.72, -2.1, seed + 9917, .95 + rand(seed + 339) * .48);
    if (rand(seed + 337) > .67) palm(-1.75, 2.5, seed + 9941, rand(seed + 344) > .5);
    if (seed % 9 === 0) {
      box("architecture", "#acb5a0", 1.9, .39, -2.05, 1.06, .74, .9);
      roof(1.9, .79, -2.05, 1.18, 1.03, .3, "#9da797", 1);
    }
    if (seed % 4 === 1) for (let panel = 0; panel < 7; panel++) box("wood", "#a79c80", -2.87 + panel * .83, .47, -2.54, .81, .85, .055);
    const orientation = Math.atan2(streetX - x, streetZ - z);
    for (const layer of LAYERS) for (let i = start[layer]; i < parts[layer].length; i++) parts[layer][i].rotateY(orientation).translate(x, 0, z);
    inlandPlots.push({ x, z, radius: 3.3 });
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
    const crest = Math.max(...[7, 7.5, 8, 8.5, 9, 9.5].map(x => duneHeight(x, accessCenter(x, z)))) + .18;
    const route = [new Vector3(6, .16, z), new Vector3(8.5, crest, z), new Vector3(9.7, crest, z + .8), new Vector3(12.5, .11, z + .8)];
    const timber = CROSS_STREETS.indexOf(z) % 3 === 0;
    // Bare access is a continuous sandy cut in the height/coverage field.
    for (let i = 0; timber && i < route.length - 1; i++) {
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
    if (row === 4) apartment(-1.975, z, row + 700);
    [-3.15, -.8, 1.55, 3.9].forEach((x, col) => {
      if ((row === 3 || row === 4) && col < 2) return;
      if (row < 4 && col >= 2) return;
      house(x, z, row * 4 + col + 1, true);
    });
  });
  buildCoastFacingHomes({ box, roof, pole, add, palm, bush, parkingRow });
  buildTenthStreetBlock({ box, roof, pole, add, palm, bush, parkingRow });
  buildBeachLandmarkHouses({ box, roof, pole, add, palm, bush, parkingRow });
  // A narrow local approach continues from the parking drive between the two
  // beach landmarks, leaving the hotel's pool enclosure to its north clear.
  box("ground", "#d2c5ad", 3.62, .035, 3.4, 5, .045, .65);
  box("ground", "#92968d", 3.62, .063, 3.4, 5, .025, .49);
  [-25, -16, -10, 14, 20.5, 30, 36].forEach((z, row) => {
    if (z >= 30) return;
    accessLane(z, true);
    [-18.2, -14.8, -11.3].forEach((x, col) => house(x, z, 50 + row * 4 + col, false));
    tree(-19.7, z - 2.3, row + 970, 1.15);
    if (row % 2) tree(-15.9, z - 2.5, row + 980, 1.1);
    tree(-20.5, z - .4, row + 30, .85);
  });
  [[-26,4],[-26,17],[-26,-25]].forEach(([x,z],i)=>house(x,z,i+90));

  // Continue the coast into the distance with a mixture of homes and commerce.
  // Far homes deliberately omit small balcony hardware to keep the hero light.
  const extendedRows = [-120, -113.5, -105, -98.5, -90, -83.5, -75, -68.5, -60, -53.5, -45];
  extendedRows.forEach((z, row) => {
    const reserved = z <= -83.5 || z === -60 || z === -53.5;
    if (!reserved) {
      accessLane(z);
      [-3.15, -.8, 1.55, 3.9].forEach((x, col) => house(x, z, 300 + row * 4 + col, true));
    }
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
    if(i%2===0) palm(-18+i*.8,-3.6,i+20);
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
  addBestWesternDetails({ box, roof, pole, add, palm, bush, parkingRow });

  buildCastilloReal({ box, roof, pole, add, palm, bush, parkingRow });

  // A modest white hotel further along the boulevard.
  box("ground","#929993",-14,.025,-32,10,.05,8);
  box("architecture","#e7e8dc",-14,1.75,-32,7.2,3.5,3.5);
  flatRoof(-14,-32,7.2,3.5,3.5,860);
  windows(-14,-32,7.2,3.5,3.5,3);
  for (const y of [1.15, 2.3, 3.5]) box("architecture", "#d4dbcb", -14, y, -30.15, 7.45, .085, .24);
  parkingRow(-14, -29.15, 11, 220);
  parkingRow(-14, -35, 11, 240, -1);
  pool(-9.8,-32,1.2,2.4);

  // Hampton Inn: distinct flat-roof ocean-side landmark and its two open lawns.
  box("ground", "#c3bca8", -.6, .028, -56.5, 10.2, .045, 12);
  box("architecture", "#e9dfc3", -2.6, 2, -56.5, 3.8, 4, 8.2);
  flatRoof(-2.6, -56.5, 3.8, 8.2, 4, 1200);
  windows(-2.6, -56.5, 3.8, 8.2, 4, 4);
  for (let floor = 1; floor <= 3; floor++) {
    box("architecture", "#f0eadb", -.55, floor, -56.5, .5, .1, 8.3);
    for (let bay = 0; bay < 9; bay++) box("glass", "#668181", -.66, floor + .5, -60 + bay * .86, .04, .58, .55);
  }
  for (const z of [-60, -53]) box("ground", "#a5a57d", 2.45, .08, z, 4.1, .055, 3.2);
  pool(2.2, -56.5, 2.7, 2.5);
  for (const z of [-61, -58.8, -54.5, -52]) palm(4.5, z, Math.round(1500 + z));
  box("ground", "#ccc5b0", 2.7, .12, -58.5, 6, .06, .5);

  // Courtyard at the southern end: three wings enclosing the pool court.
  box("ground", "#999e94", -14.5, .025, 32, 12, .05, 12.5);
  for (const [x,z,w,d] of [[-18.5,32,2.5,9],[-14.5,28.7,5.5,2.5],[-14.5,35.3,5.5,2.5]]) {
    box("architecture", "#e6ddc7", x, 1.7, z, w, 3.4, d);
    flatRoof(x,z,w,d,3.4,1300); windows(x,z,w,d,3.4,3);
  }
  pool(-14.3,32,3.2,2.5);
  parkingRow(-14.5,37.2,12,1320);

  // The northern pier precinct and Embassy Suites are separate reserved parcels.
  box("ground", "#c2c3b6", -.1, .03, -94.5, 10, .05, 17);
  for (let row=0; row<5; row++) {
    const z=-101.5+row*3.1;
    parkingRow(-.4,z,10,1400+row*20,1,"#bfc0b4");
    palm(4.3,z,1450+row);
    box("ground", "#a4a781", 4.3, .05, z, .7, .05, 1.7);
  }
  // Pier crosses sand and surf with open support bays, not a solid seawall.
  box("wood", "#ac9273", 19, 1.1, -94, 29, .17, 1.05);
  box("wood", "#ae957b", 33.1, 1.1, -94, 1.8, .17, 1.6);
  for(let i=0;i<24;i++) {
    const x=5.1+i*1.2;
    for(const side of [-1,1]) {
      pole(new Vector3(x,-.3,-94+side*.42),new Vector3(x,1.5,-94+side*.42),.045,"#8f8876");
      if(i<23) pole(new Vector3(x,1.48,-94+side*.45),new Vector3(x+1.2,1.48,-94+side*.45),.025,"#d8cbb3");
    }
  }
  // Three sand courts with fine open nets beside an open-sided pavilion.
  box("ground", "#e4d6b9", .6,.045,-106.2,8.5,.05,5.3);
  for(let court=0;court<3;court++) {
    const x=-2.3+court*2.8;
    for(const side of [-1,1]) {
      box("ground", "#eee8d6", x+side*1.1,.085,-106.2,.025,.015,4.4);
      box("ground", "#eee8d6", x,.085,-106.2+side*2.2,2.2,.015,.025);
      pole(new Vector3(x+side*1.15,0,-106.2),new Vector3(x+side*1.15,1,-106.2),.025,"#83958d");
    }
    for(let line=0;line<4;line++) pole(new Vector3(x-1.15,.58+line*.11,-106.2),new Vector3(x+1.15,.58+line*.11,-106.2),.008,"#d9d8ca");
    for(let line=0;line<12;line++) pole(new Vector3(x-1.1+line*.2,.58,-106.2),new Vector3(x-1.1+line*.2,.91,-106.2),.006,"#8a9389");
  }
  for(const x of [3.4,5.4])for(const z of [-109,-106.9])pole(new Vector3(x,0,z),new Vector3(x,1.2,z),.065,"#a6a38b");
  roof(4.4,1.25,-108,2.6,2.8,.6,"#637d70");
  box("ground", "#d6cbb5", -.2,.025,-118,11,.05,16);
  for(const [x,z,w,d] of [[-3.9,-117,2,13],[-.8,-123,4.5,2],[1.2,-118,2,8]]) {
    box("architecture", "#e6e7dc", x,1.6,z,w,3.2,d);
    flatRoof(x,z,w,d,3.2,1600);windows(x,z,w,d,3.2,3);
    for(const side of [-1,1]) box("roof", "#7f938b", x+side*w*.46,3.28,z,.28,.2,d+.1);
  }
  pool(3.7,-113,2.3,3.8);
  add("ground",new CylinderGeometry(1.55,1.55,.055,32),"#83a078",3.7,.06,-119);
  for(const z of [-111,-116,-121])palm(5.4,z,Math.round(1800+z));

  // The western neighborhoods are a connected extension, with irregular older homes
  // and mature canopy instead of another repeated band of beachfront apartments.
  localRoad(-45, -128, -45, 57, 1.85);
  const westSpine = [[-74,-128],[-74,-99],[-76,-76],[-75,-55],[-78,-29],[-75,-5],[-75,19],[-73,45],[-75,57]];
  for (let i = 0; i < westSpine.length - 1; i++) localRoad(...westSpine[i] as [number, number], ...westSpine[i + 1] as [number, number], 1.8);
  for (const z of CROSS_STREETS) {
    const west = [-124, -94, -64, -39, -19, 10, 40, 55].includes(z);
    const westRoad = westSpine.findIndex((point, i) => i < westSpine.length - 1 && z >= point[1] && z <= westSpine[i + 1][1]);
    const endX = west && westRoad >= 0 ? westSpine[westRoad][0] + (westSpine[westRoad + 1][0] - westSpine[westRoad][0]) * (z - westSpine[westRoad][1]) / (westSpine[westRoad + 1][1] - westSpine[westRoad][1]) : -69;
    localRoad(-29, z, endX, z, z === -39 ? 1.85 : 1.45);
    if (!west) add("ground", new CylinderGeometry(1.45, 1.45, .035, 24), "#818985", endX, .049, z);
  }
  const outerLoop = [[-74.43,-94],[-85,-101],[-92,-99],[-97,-91],[-97,-67],[-94,-47],[-90,-31],[-84,-21],[-76.75,-19]];
  for (let i = 0; i < outerLoop.length - 1; i++) localRoad(...outerLoop[i] as [number, number], ...outerLoop[i + 1] as [number, number], 1.55);
  // Local streets stay unmarked; the shorter spurs terminate in turning bulbs.
  CROSS_STREETS.slice(0, -1).forEach((south, block) => {
    const north = CROSS_STREETS[block + 1], depth = north - south;
    const rows = depth < 12 ? [(south + north) / 2] : [south + 4.6, north - 4.6];
    for (let row = 0; row < rows.length; row++) for (let col = 0; col < 5; col++) {
      const seed = 12000 + block * 137 + row * 31 + col * 7;
      const x = [-33.8, -40, -51.5, -58.5, -65.2][col] + (rand(seed + 9) - .5) * .55;
      const z = rows[row] + (rand(seed + 10) - .5) * .42;
      // Selected vacant, grassy parcels give large trees space and break house rows.
      if (rand(seed + 70) < .16) continue;
      const streetZ = row === 0 && depth >= 12 ? south : north;
      inlandHome(x, z, seed, x, streetZ);
    }
  });
  const groveHomes = [[-82,-89],[-90,-89],[-83,-77],[-90,-74],[-85,-60],[-88,-48],[-83,-36],[-79,-109],[-88,-110],[-82,1],[-84,15],[-81,31],[-83,46]];
  groveHomes.forEach(([x, z], i) => {
    const street = nearestRoad(x, z);
    if (street.distance < 11) inlandHome(x, z, 17001 + i * 37, street.x, street.z);
  });
  // Seeded groves preserve open roads and building clearances while allowing high
  // canopies to interlock. Clearings vary in size instead of one tree per grid cell.
  let groveCount = 0;
  for (let ix = 0; ix < 27; ix++) for (let iz = 0; iz < 61; iz++) {
    const seed = 25001 + ix * 181 + iz * 23;
    const x = -99 + ix * 2.65 + rand(seed) * 1.4, z = -125 + iz * 2.9 + rand(seed + 1) * 1.5;
    if (x > -29) continue;
    const clustering = Math.sin(x * .19 + z * .08) + Math.sin(z * .2 - x * .12);
    if (rand(seed + 2) > .32 + clustering * .15) continue;
    const street = nearestRoad(x, z);
    if (street.distance < street.width / 2 + .7) continue;
    if (inlandPlots.some(plot => Math.hypot(x - plot.x, z - plot.z) < plot.radius + .45)) continue;
    if (groveCount >= 225) continue;
    tree(x, z, seed + 11, 1.05 + rand(seed + 14) * 1.2);
    if (rand(seed + 16) > .78) palm(x + .7, z - .6, seed + 17);
    if (rand(seed + 18) > .5) bush(x + .9, z + .6, seed + 19, .35 + rand(seed + 21) * .55);
    groveCount++;
  }
  // Sparse traffic follows the right-hand lanes and clears intersections.
  for (let i = 0; i < 32; i++) {
    const z = -126 + i * 5.7 + rand(29000 + i) * 2;
    if (CROSS_STREETS.some(crossing => Math.abs(crossing - z) < 1.85)) continue;
    const direction = i % 2 === 0 ? 1 : -1;
    car(-6.7 - direction * .51, z, 29100 + i, direction > 0 ? 0 : Math.PI);
  }
  for (let i = 0; i < 19; i++) {
    const z = -119 + i * 8.6;
    if (CROSS_STREETS.some(crossing => Math.abs(crossing - z) < 2)) continue;
    const direction = i % 2 === 0 ? 1 : -1;
    car(-45 - direction * .39, z, 29500 + i, direction > 0 ? 0 : Math.PI);
  }
  for (const [x, z, direction] of [[-35,-19,1],[-56,-39,-1],[-58,10,1],[-38,-64,-1],[-53,-94,1],[-32,40,-1]]) {
    car(x, z + direction * .32, 30000 + Math.abs(Math.round(x * z)), direction > 0 ? Math.PI / 2 : -Math.PI / 2);
  }

  // Gardens and roadside palms.
  for(let i=0;i<48;i++){
    const z=-126+i*3.7;
    if(CROSS_STREETS.every(s=>Math.abs(z-s)>1.6)) palm(-8.8,z,i+100);
  }
  // Thin arching grass blades emerge from irregular mats, with exposed sand
  // between clumps. Height/coverage matches the terrain instead of buried balls.
  const grassColors = ["#92916a", "#7f865a", "#b3aa7c", "#a29d72"];
  const grassVertices: number[][] = grassColors.map(() => []);
  for (let i = 0; i < 7800; i++) {
    const seed = 44000 + i * 19;
    const x = 6.1 + rand(seed) * 6.2, z = -130 + rand(seed + 1) * 194;
    if (duneAccessDistance(x, z) < .53 || rand(seed + 2) > duneCoverage(x, z) * 1.8) continue;
    const height = .1 + Math.pow(rand(seed + 3), 2) * .38;
    const radius = .05 + rand(seed + 4) * .13;
    for (let blade = 0; blade < 7; blade++) {
      const angle = rand(seed + blade * 7 + 5) * Math.PI * 2;
      const bx = x + Math.cos(angle) * radius * rand(seed + blade + 30);
      const bz = z + Math.sin(angle) * radius * rand(seed + blade + 31);
      const by = duneHeight(bx, bz) + .002;
      const bladeHeight = height * (.65 + rand(seed + blade + 41) * .5);
      const lean = .06 + rand(seed + blade + 43) * .15;
      const width = .013 + rand(seed + blade + 44) * .014;
      const vertices = grassVertices[(i + blade) % grassColors.length];
      const point = (t: number, side: number) => [
        bx + Math.cos(angle) * lean * t * t + Math.sin(angle) * width * (1 - t) * side,
        by + bladeHeight * t - bladeHeight * .2 * t * t,
        bz + Math.sin(angle) * lean * t * t - Math.cos(angle) * width * (1 - t) * side,
      ];
      for (let segment = 0; segment < 3; segment++) {
        const a = segment / 3, b = (segment + 1) / 3;
        vertices.push(...point(a, -1), ...point(b, -1), ...point(a, 1), ...point(a, 1), ...point(b, -1), ...point(b, 1));
      }
    }
  }
  grassVertices.forEach((vertices, i) => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    add("foliage", geometry, grassColors[i], 0, 0, 0);
  });
  for (const z of [-35, -21.5, -7.1, 11.6, 26.5, 40]) {
    tree(-4.25, z, Math.round(z + 100), .65);
    palm(5.6, z, z + 400);
  }
  addCoastalVisitors({ box, roof, pole, add, palm, bush, parkingRow });
  return Object.fromEntries(LAYERS.map(layer=>{
    const geometry=mergeGeometries(parts[layer]);
    parts[layer].forEach(g=>g.dispose());
    if(!geometry)throw new Error(`Unable to build coastal ${layer}`);
    geometry.computeBoundingSphere();
    return [layer,geometry];
  })) as CoastalTown;
}
