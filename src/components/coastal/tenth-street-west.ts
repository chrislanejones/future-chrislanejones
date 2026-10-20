import { CatmullRomCurve3, CircleGeometry, CylinderGeometry, TubeGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";
import { signLettering } from "./sign-lettering";

/** The quieter 10th Street stretch across A1A: low cottages and deeper green yards. */
export function buildTenthStreetWest(kit: CastilloKit) {
  const { box, add, roof, pole, palm, bush } = kit;
  const trim = "#ececdf", glass = "#5a777c", lane = -12.4;
  box("ground", "#a8ab9a", -14.42, .073, lane, 15.15, .055, 1.26);
  box("ground", "#979c92", -14.42, .109, lane, 15.15, .025, .97);
  for (let stripe = 0; stripe < 5; stripe++) box("ground", "#ece7d7", -6.7, .128, lane - .35 + stripe * .17, 2.04, .009, .08);
  const window = (x: number, y: number, z: number, w: number, h: number, facing: number) => {
    box("architecture", trim, x, y, z, w + .09, h + .09, .035);
    box("glass", glass, x, y, z + facing * .028, w, h, .025);
    box("wood", trim, x, y, z + facing * .047, .02, h, .02);
    box("wood", trim, x, y, z + facing * .047, w, .025, .02);
  };
  const rail = (x: number, y: number, z: number, w: number) => {
    box("wood", trim, x, y + .27, z, w, .025, .025);
    for (let n = 0; n < Math.floor(w / .095); n++) box("wood", trim, x - w / 2 + .045 + n * .095, y + .14, z, .014, .25, .016);
  };
  const parked = (x: number, z: number, color: string) => {
    box("architecture", color, x, .23, z, .43, .23, .83);
    box("glass", "#364e57", x, .4, z, .34, .18, .39);
    box("architecture", color, x, .49, z, .36, .028, .3);
    for (const side of [-1, 1]) for (const end of [-1, 1]) add("wood", new CylinderGeometry(.088, .088, .034, 10).rotateZ(Math.PI / 2), "#35433d", x + side * .219, .17, z + end * .26);
  };
  const drive = (x: number, z: number, facing: number, pavers = false) => {
    const front = z + facing * 1.12, edge = lane - facing * .53, length = Math.abs(front - edge);
    box("ground", pavers ? "#b0b09f" : "#c3c1ae", x, .049, (front + edge) / 2, 1.02, .044, length);
    if (pavers) for (let n = 0; n < Math.floor(length / .15); n++) box("ground", "#9c9f8c", x, .076, Math.min(front, edge) + n * .15, 1.02, .008, .009);
    parked(x, front + facing * .72, pavers ? "#6a777a" : "#d9dacd");
    box("wood", "#dfdcc7", x - .94, .22, edge, .036, .4, .04);
    box("architecture", pavers ? "#769c9a" : "#a9a48e", x - .94, .4, edge, .19, .1, .1);
  };

  // Turquoise low commercial corner has a simple parapet, pale storefront trim,
  // paved parking and wheel stops. The photographic agency brand is not copied.
  const ox = -10.2, oz = -10;
  box("ground", "#cbc6b2", ox, .035, oz - 1.7, 3.3, .05, 1.58);
  box("architecture", "#77acb2", ox, .65, oz, 2.85, 1.2, 1.93);
  box("roof", "#b8c3b5", ox, 1.27, oz, 3.0, .1, 2.05);
  box("architecture", "#74a9ae", ox, 1.46, oz, 2.99, .31, 2.04);
  box("architecture", trim, ox, 1.325, oz - 1.029, 3.01, .042, .035);
  for (const x of [ox - .84, ox + .73]) window(x, .68, oz - .989, .58, .54, -1);
  box("architecture", trim, ox - .04, .52, oz - .998, .37, .94, .037);
  box("glass", glass, ox - .04, .6, oz - 1.02, .27, .64, .025);
  add("architecture", signLettering("REAL ESTATE", .97), "#f0efda", ox, 1.472, oz - 1.036, Math.PI);
  for (let n = 0; n < 4; n++) {
    box("ground", trim, ox - 1.35 + n * .76, .074, -11.69, .028, .009, .64);
    box("ground", "#b5b3a0", ox - .96 + n * .76, .106, -11.26, .38, .064, .08);
  }
  parked(-9.25, -11.48, "#e3e2d4");

  // Raised pale cottage opposite: open underside, side stairs and light cladding.
  const rx = -10.7, rz = -16;
  box("architecture", "#cccab5", rx, 1.69, rz, 2.15, 1.32, 2.35);
  for (const x of [rx - .97, rx, rx + .97]) for (const z of [rz - 1.05, rz + 1.05]) box("architecture", trim, x, .56, z, .14, 1.07, .16);
  roof(rx, 2.39, rz, 2.4, 2.62, .39, "#858f83", 2);
  for (const x of [rx - .56, rx + .56]) window(x, 1.71, rz + 1.193, .63, .62, 1);
  for (let n = 0; n < 12; n++) box("wood", "#b6b9a5", rx, 1.06 + n * .106, rz + 1.18, 2.1, .009, .011);
  box("ground", "#c4c0ac", rx, .032, -14.11, 2.47, .048, 2.12);
  for (let n = 0; n < 10; n++) box("wood", trim, rx + 1.29, .08 + n * .1, -13.73 - n * .13, .37, .09, .155);
  pole(new Vector3(rx + 1.47, .46, -13.74), new Vector3(rx + 1.47, 1.38, -14.93), .019, trim);
  box("wood", "#525e51", rx + .68, .17, rz, .18, .31, .2);

  // North-side two-level blue porch home and attached single-floor garage wing.
  const bx = -14.8, bz = -16;
  box("architecture", "#91b6c1", bx, 1.39, bz, 2.16, 2.7, 2.7);
  roof(bx, 2.8, bz, 2.4, 3.0, .42, "#899688", 1);
  for (const y of [.42, 1.69]) {
    box("wood", trim, bx, y, -14.37, 2.31, .085, .74);
    for (const x of [bx - 1.02, bx, bx + 1.02]) box("architecture", trim, x, y + .53, -14.06, .085, 1.0, .085);
    rail(bx, y + .05, -14.02, 2.14);
    for (const x of [bx - .58, bx + .58]) window(x, y + .57, -14.638, .42, .62, 1);
  }
  roof(bx, 2.8, -14.32, 2.39, 1.09, .43, "#899688", 1);
  add("architecture", new CircleGeometry(.125, 20), trim, bx, 3.0, -13.767);
  add("glass", new CircleGeometry(.09, 20), "#627d7c", bx, 3.0, -13.756);
  box("architecture", "#89adbb", bx - 1.53, .6, bz + .08, .9, 1.1, 2.26);
  roof(bx - 1.5, 1.21, bz + .08, 1.16, 2.52, .3, "#929c8c");
  box("architecture", trim, bx - 1.53, .6, -14.781, .67, .89, .035);
  for (let n = 0; n < 6; n++) box("wood", "#b4beae", bx - 1.53, .23 + n * .13, -14.758, .64, .009, .013);
  drive(bx - 1.53, bz, 1);

  // Three smaller cottages differ in facade shape, driveway material and gardens.
  for (const [x, z, color, facing, variant] of [[-18.4, -16, "#e5ce96", 1, 0], [-14.8, -10, "#add0a0", -1, 1], [-18.4, -10, "#7eaabc", -1, 2]] as const) {
    box("architecture", color, x, .71, z, 2.08, 1.33, 2.3);
    roof(x, 1.43, z, 2.31, 2.54, .37, variant === 0 ? "#a1a897" : "#899b90", 1);
    const front = z + facing * 1.17;
    window(x + .56, .83, front, .47, .63, facing);
    if (variant > 0) {
      box("architecture", trim, x - .53, .59, front, .7, .98, .035);
      for (let panel = 0; panel < 6; panel++) box("wood", "#bbc4af", x - .53, .18 + panel * .16, front + facing * .028, .65, .01, .016);
      box("architecture", color, x + .79, .76, front + facing * .17, .39, 1.43, .47);
      roof(x + .72, 1.48, front + facing * .08, .77, .68, .23, "#899b90", 1);
    } else window(x - .53, .8, front, .54, .59, facing);
    drive(x - .5, z, facing, variant === 0);
    for (const offset of [-1.03, 1.16]) {
      palm(x + offset, lane - facing * 1.18, 9315 + variant * 30 + Math.round(offset * 5), true);
      bush(x + offset, lane - facing * 1.72, 9340 + variant, .23);
    }
    for (let n = 0; n < 16; n++) box("wood", variant === 1 ? "#e0dfc9" : "#a89e81", x + 1.15, .31, z - 1.7 + n * .21, .035, .53, .18);
  }
  for (const x of [-9.15, -16.9, -21.05]) {
    pole(new Vector3(x, .05, -13.16), new Vector3(x, 3.11, -13.16), .035, "#969781");
    box("wood", "#727f70", x, 2.91, -13.16, .075, .055, .64);
    add("architecture", new CylinderGeometry(.044, .045, .18, 8), "#b5baa5", x, 2.71, -13.22);
  }
  for (const [a, b] of [[-21.05, -16.9], [-16.9, -9.15]]) for (const z of [-13.38, -13.13]) {
    const cable = new CatmullRomCurve3([new Vector3(a, 2.97, z), new Vector3((a + b) / 2, 2.67, z), new Vector3(b, 2.97, z)]);
    add("wood", new TubeGeometry(cable, 24, .005, 4, false), "#586b60", 0, 0, 0);
  }
}
