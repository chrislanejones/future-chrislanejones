import { BufferAttribute, BufferGeometry, CylinderGeometry, Shape, ShapeGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";

/** Two compact, photo-guided landmarks beside the 9th Street beach approach. */
export function buildBeachLandmarkHouses(kit: CastilloKit) {
  const { box, roof, add, pole, bush } = kit;
  const glass = "#456469", wood = "#a99b7c", cream = "#eee4c9";
  const shape = (points: number[][], color: string, x: number, y: number, z: number, turn = 0) => {
    const polygon = new Shape();
    polygon.moveTo(points[0][0], points[0][1]);
    for (const p of points.slice(1)) polygon.lineTo(p[0], p[1]);
    polygon.closePath();
    add("architecture", new ShapeGeometry(polygon), color, x, y, z, turn);
  };
  const window = (x: number, y: number, z: number, w: number, h: number, turn = 0, trim = cream) => {
    box("architecture", trim, x, y, z, w + .065, h + .065, .025, turn);
    const outward = new Vector3(0, 0, .018).applyAxisAngle(new Vector3(0, 1, 0), turn);
    box("glass", glass, x + outward.x, y, z + outward.z, w, h, .018, turn);
    const bar = new Vector3(0, 0, .03).applyAxisAngle(new Vector3(0, 1, 0), turn);
    box("wood", trim, x + bar.x, y, z + bar.z, .018, h, .018, turn);
    box("wood", trim, x + bar.x, y, z + bar.z, w, .018, .018, turn);
  };
  const rail = (a: Vector3, b: Vector3, height = .35) => {
    pole(a.clone().add(new Vector3(0, height, 0)), b.clone().add(new Vector3(0, height, 0)), .021, wood);
    const count = Math.ceil(a.distanceTo(b) / .09);
    for (let i = 0; i <= count; i++) {
      const p = a.clone().lerp(b, i / count);
      pole(p, p.clone().add(new Vector3(0, height, 0)), .012, wood);
    }
  };

  // The tan house has two real open garage bays, blue entry doors and a modest
  // shark-jaw ornament upstairs. The jaw is not a person-sized entrance.
  const front = .88;
  box("ground", "#b68b71", 4.75, .035, -.45, 2.3, .065, 4.1);
  for (let n = 0; n < 14; n++) box("ground", "#9f7e68", 4.75, .071, -2.36 + n * .29, 2.3, .007, .012);
  box("architecture", "#aa9878", 4.75, .085, -.52, 2.03, .12, 2.8);
  for (const x of [3.79, 5.71]) box("architecture", "#b7a17d", x, .64, -.52, .11, 1.08, 2.8);
  box("architecture", "#a89577", 4.75, .64, -1.88, 1.95, 1.08, .1);
  for (const x of [3.8, 4.48, 5.1, 5.7]) box("architecture", "#c4ac85", x, .65, front, .12, 1.1, .12);
  box("architecture", "#bfac8b", 4.79, .64, front - .18, .6, 1.08, .1);
  box("architecture", "#225e89", 4.64, .55, front - .114, .24, .87, .035);
  box("glass", "#395c64", 4.64, .65, front - .09, .095, .31, .018);
  window(4.95, .7, front - .111, .18, .34, 0, "#5c5b4f");
  box("wood", "#c0b89a", 4.7, .52, front - .085, .021, .06, .021);
  box("architecture", "#cbb38a", 4.75, 1.72, -.52, 2.03, 1.1, 2.8);
  box("architecture", "#a79070", 4.75, 1.19, -.52, 2.08, .12, 2.84);
  for (let n = 0; n < 12; n++) {
    const y = 1.24 + n * .087;
    box("wood", "#bba37e", 4.75, y, front + .006, 2.03, .009, .012);
    for (const x of [3.731, 5.769]) box("wood", "#bba37e", x, y, -.52, .012, .009, 2.79);
  }
  for (const x of [4.01, 4.58, 5.34]) window(x, 1.93, front + .024, .37, .48, 0, "#71654e");
  for (const z of [-1.42, -.38]) {
    window(5.782, 1.86, z, .42, .46, Math.PI / 2, "#71654e");
    window(3.718, 1.86, z, .42, .46, -Math.PI / 2, "#71654e");
  }
  roof(4.75, 2.29, -.52, 2.2, 2.99, .47, "#a88263");
  // Slightly pointed oval jaw ring, with small inward-facing cream teeth.
  const jawVertices: number[] = [];
  const jawPoint = (angle: number, outside: boolean) => {
    const scale = outside ? 1 : .76;
    const peak = Math.max(0, Math.sin(angle)) ** 4 * .055;
    return [Math.cos(angle) * .19 * scale, Math.sin(angle) * .205 * scale + peak, .009];
  };
  for (let n = 0; n < 36; n++) {
    const a = n / 36 * Math.PI * 2, b = (n + 1) / 36 * Math.PI * 2;
    jawVertices.push(...jawPoint(a, false), ...jawPoint(a, true), ...jawPoint(b, true),
      ...jawPoint(a, false), ...jawPoint(b, true), ...jawPoint(b, false));
  }
  const jaw = new BufferGeometry();
  jaw.setAttribute("position", new BufferAttribute(new Float32Array(jawVertices), 3));
  jaw.computeVertexNormals();
  add("architecture", jaw, "#e7d4ae", 4.97, 1.68, front + .045);
  for (let n = 0; n < 22; n++) {
    const a = n / 22 * Math.PI * 2;
    const r = .145, py = Math.sin(a) * .156 + Math.max(0, Math.sin(a)) ** 4 * .04;
    const dx = Math.cos(a) * r, tx = -Math.sin(a) * .018, ty = Math.cos(a) * .018;
    shape([[dx + tx, py + ty], [dx - tx, py - ty], [dx * .79, py * .79]], "#f5efdc", 4.97, 1.68, front + .06);
  }
  // An open garage is legible through its recessed back, floor and parked car.
  box("architecture", "#f0eee2", 5.38, .3, -.03, .42, .23, .72);
  box("glass", "#526a70", 5.38, .48, -.03, .35, .2, .36);
  for (const x of [5.15, 5.61]) for (const z of [-.25, .2]) add("wood", new CylinderGeometry(.085, .085, .035, 10).rotateZ(Math.PI / 2), "#3d4540", x, .2, z);
  for (const [x, z] of [[3.92, 1.29], [5.57, 1.29]]) {
    box("ground", "#d6c5a3", x, .085, z, .47, .065, .32);
    bush(x, z, 6123, .12);
  }

  // The olive house across the approach has a wraparound raised deck and a
  // warm geometric mural wrapping its garage corner, not a generic pastel box.
  const olive = "#93917a", timber = "#a69c85", trim = "#c6a276";
  box("ground", "#c9c2af", 4.75, .028, 5.7, 2.3, .05, 3.8);
  box("architecture", olive, 4.6, 1.14, 5.76, 1.7, 2.19, 2.55);
  box("architecture", "#888772", 4.63, .59, 4.47, .66, 1.04, .045);
  for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) box("architecture", "#96937e", 4.4 + col * .23, .23 + row * .23, 4.438, .21, .19, .018);
  roof(4.6, 2.25, 5.76, 1.95, 2.78, .25, "#777568");
  // Cross-hip projection and a low eave give this roof its asymmetric outline.
  roof(4.31, 2.18, 4.85, 1.31, .92, .27, "#85806a");
  for (const z of [5.15, 6.21]) window(3.734, 1.71, z, .45, .46, -Math.PI / 2, trim);
  window(4.16, 1.73, 4.458, .42, .44, Math.PI, trim);
  window(4.95, 1.73, 4.458, .3, .44, Math.PI, trim);
  window(5.466, 1.73, 6.25, .7, .48, Math.PI / 2, trim);
  box("architecture", "#a86f46", 3.79, .54, 5.01, .025, .86, .26);
  // Three sides of the east deck remain open under the slab; slender posts
  // support the edge and the rail follows its footprint within the dune setback.
  box("wood", timber, 5.57, 1.15, 6.16, .55, .11, 1.69);
  box("wood", timber, 4.82, 1.15, 7.16, 2.04, .11, .32);
  for (const [x, z] of [[5.79, 5.4], [5.79, 6.12], [5.79, 7.23], [4.04, 7.23]]) pole(new Vector3(x, .06, z), new Vector3(x, 1.2, z), .035, timber);
  rail(new Vector3(5.8, 1.2, 5.37), new Vector3(5.8, 1.2, 7.24));
  rail(new Vector3(3.84, 1.2, 7.27), new Vector3(5.8, 1.2, 7.27));
  for (let n = 0; n < 9; n++) box("wood", "#b4aa91", 5.55, .12 + n * .122, 4.42 + n * .104, .42, .12, .115);
  pole(new Vector3(5.78, .45, 4.38), new Vector3(5.78, 1.55, 5.3), .019, timber);

  // Flat colored polygons sit just above the stucco. Nested geometric rosettes
  // and the corner ribbon suggest the supplied mural without a texture decal.
  const rosette = (x: number, y: number, z: number, turn: number, size: number) => {
    for (let ring = 0; ring < 5; ring++) {
      const r = size * (1 - ring * .16), points: number[][] = [];
      for (let n = 0; n < 16; n++) {
        const a = n / 16 * Math.PI * 2 + (ring % 2) * Math.PI / 8;
        const radius = n % 2 ? r * .84 : r;
        points.push([Math.cos(a) * radius, Math.sin(a) * radius]);
      }
      const offset = new Vector3(0, 0, ring * .002).applyAxisAngle(new Vector3(0, 1, 0), turn);
      shape(points, ["#d0804d", "#f1dca6", "#bb613b", "#e0af63", "#f2dfad"][ring], x + offset.x, y, z + offset.z, turn);
    }
  };
  rosette(4.04, .77, 4.436, Math.PI, .32);
  rosette(3.735, .69, 4.97, -Math.PI / 2, .34);
  for (let n = 0; n < 8; n++) {
    const y = .15 + n * .122;
    shape([[-.16, -.08], [.14, -.03], [.2, .08], [-.09, .065]], n % 2 ? "#f0dfa8" : "#cd7247", 3.87, y, 4.428 - n * .0001, Math.PI);
  }
  for (const z of [5.47, 6.44]) bush(3.77, z, 6270 + Math.round(z), .15);
}
