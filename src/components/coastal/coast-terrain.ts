import { BufferAttribute, BufferGeometry } from "three";

// One height field grounds sand, planting, access paths, and the shadow receiver.
export const CROSS_STREETS = [-124, -109, -94, -79, -64, -49, -39, -19, -5, 10, 25, 40, 55];
const smooth = (a: number, b: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const hash = (x: number, z: number) => {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return value - Math.floor(value);
};
function noise(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = smooth(0, 1, x - ix), fz = smooth(0, 1, z - iz);
  const a = hash(ix, iz) * (1 - fx) + hash(ix + 1, iz) * fx;
  const b = hash(ix, iz + 1) * (1 - fx) + hash(ix + 1, iz + 1) * fx;
  return a * (1 - fz) + b * fz;
}

export function accessCenter(x: number, street: number) {
  const timber = CROSS_STREETS.indexOf(street) % 3 === 0;
  return street + (timber ? smooth(8.5, 9.7, x) * .8 : Math.sin((x - 6) * .7) * .14);
}

export function duneAccessDistance(x: number, z: number) {
  const localNinthStreet = Math.abs(z - (3.4 + Math.sin((x - 6) * .7) * .14));
  const localTenthStreet = Math.abs(z - (-12.4 + Math.sin((x - 6) * .6) * .12));
  return Math.min(localNinthStreet, localTenthStreet, ...CROSS_STREETS.map(street => Math.abs(z - accessCenter(x, street))));
}

export function duneHeight(x: number, z: number) {
  if (x <= 5.75 || x >= 14) return 0;
  const ridge = 8.15 + Math.sin(z * .16) * .46 + Math.sin(z * .39) * .16;
  const width = x < ridge ? 1.35 : 2.05;
  const primary = Math.exp(-Math.pow((x - ridge) / width, 2))
    * (.48 + Math.sin(z * .12) * .13 + Math.cos(z * .33) * .09);
  const hummocks = Math.exp(-Math.pow((x - 10.5 - Math.sin(z * .29) * .38) / 1.3, 2))
    * (.11 + noise(x * .8, z * .65) * .13);
  const access = .55 + .45 * smooth(.28, 1, duneAccessDistance(x, z));
  return (primary + hummocks) * access * smooth(5.75, 6.45, x) * (1 - smooth(12, 14, x));
}

export function duneCoverage(x: number, z: number) {
  if (x < 6 || x > 12.5 || z < -131 || z > 64) return 0;
  const edge = smooth(6, 7, x) * (1 - smooth(9.2, 12.3, x));
  const patches = noise(x * 1.1, z * .7) * .68 + noise(x * 3.7, z * 2.8) * .32;
  return edge * smooth(.3, .7, patches) * smooth(.38, .8, duneAccessDistance(x, z));
}

export function makeCoastTerrain() {
  // Concentrate tessellation on dune relief and nearshore waves. The outer apron
  // extends beyond the fog so exploring the town never exposes a rectangle edge.
  const xs = [-1000, -300, -160, -110, -75, -45, -20, 0, 4];
  for (let x = 4.16; x < 13; x += .16) xs.push(x);
  for (let x = 13; x < 35; x += .45) xs.push(x);
  for (let x = 35; x < 150; x += 3) xs.push(x);
  xs.push(300, 1000);
  const zs = [-1000, -400, -220, -160];
  for (let z = -140; z <= 80; z += .4) zs.push(z);
  zs.push(140, 250, 400, 1000);
  const positions: number[] = [], cover: number[] = [], indices: number[] = [];
  for (const z of zs) for (const x of xs) {
    positions.push(x, duneHeight(x, z), z);
    cover.push(duneCoverage(x, z));
  }
  for (let row = 0; row < zs.length - 1; row++) for (let col = 0; col < xs.length - 1; col++) {
    const a = row * xs.length + col, b = a + 1, c = a + xs.length, d = c + 1;
    indices.push(a, c, b, b, c, d);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("duneCover", new BufferAttribute(new Float32Array(cover), 1));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
