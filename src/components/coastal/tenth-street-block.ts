import { CircleGeometry, ConeGeometry, CylinderGeometry, IcosahedronGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";

/** A compact study of the new 10th Street photos, north of the Castillo parcel. */
export function buildTenthStreetBlock(kit: CastilloKit) {
  const { box, add, roof, pole, palm, bush } = kit;
  const cream = "#eee9d9", glass = "#4f7581", gray = "#a9a796";
  const rail = (a: Vector3, b: Vector3, color = cream, height = .32) => {
    pole(a.clone().add(new Vector3(0, height, 0)), b.clone().add(new Vector3(0, height, 0)), .018, color);
    const count = Math.ceil(a.distanceTo(b) / .12);
    for (let i = 0; i <= count; i++) {
      const p = a.clone().lerp(b, i / count);
      pole(p, p.clone().add(new Vector3(0, height, 0)), .011, color);
    }
  };
  const frontWindow = (x: number, y: number, z: number, w = .45, h = .6) => {
    box("architecture", cream, x, y, z, w + .08, h + .08, .035);
    box("glass", glass, x, y, z - .025, w, h, .022);
    box("architecture", cream, x, y, z - .041, .024, h, .018);
    box("architecture", cream, x, y, z - .041, w, .022, .018);
  };
  const smallCar = (x: number, z: number, color: string) => {
    box("architecture", color, x, .23, z, .41, .22, .79);
    box("glass", "#354e57", x, .38, z, .32, .16, .41);
    box("architecture", color, x, .47, z, .33, .028, .29);
    for (const side of [-1, 1]) for (const end of [-1, 1]) box("wood", "#39443e", x + side * .21, .13, z + end * .26, .035, .15, .14);
  };

  // Keep the local road unmarked, with sandy shoulders and an open dune cut.
  box("ground", "#c8c2ae", -.35, .052, -12.4, 12.8, .04, 1.12);
  box("ground", "#9fA399", -.35, .078, -12.4, 12.8, .022, .83);

  // Sea Ray pin-side building: open parking plus three recessed balcony levels.
  const sx = 3.9, sz = -10, west = 2.95, east = 4.85;
  box("ground", "#b4ae98", sx, .044, sz, 2.6, .055, 3.04);
  box("architecture", "#d1ccba", west + .05, .43, sz, .12, .73, 2.52);
  for (const x of [west, sx, east]) for (const z of [-11.22, -8.78]) {
    box("architecture", cream, x, .43, z, .12, .77, .13);
    // Small angled haunches soften the top corners of the open garage bays.
    box("architecture", cream, x + .085, .744, z, .16, .12, .13, .12);
  }
  box("architecture", "#e2dccb", sx, 2.27, sz, 1.9, 2.9, 2.5);
  for (let floor = 0; floor < 3; floor++) {
    const y = .84 + floor * .97;
    box("architecture", cream, 5.12, y, sz, .7, .09, 2.59);
    for (const z of [-10.82, -10, -9.18]) {
      box("glass", glass, east + .022, y + .43, z, .03, .69, .49);
      box("architecture", cream, east + .04, y + .43, z, .04, .7, .022);
    }
    rail(new Vector3(5.45, y + .05, -11.21), new Vector3(5.45, y + .05, -8.79), "#d8d7c8");
    for (const z of [-11.22, -8.78]) frontWindow(3.22, y + .47, z - .03, .28, .55);
  }
  for (const z of [-11.24, -10.42, -9.58, -8.76]) box("architecture", cream, 5.36, 2.26, z, .18, 2.98, .12);
  box("roof", "#c0bfae", 4.15, 3.76, sz, 2.7, .12, 2.74);
  for (const x of [2.81, 5.49]) box("architecture", gray, x, 3.88, sz, .1, .23, 2.82);
  for (const z of [-11.36, -8.64]) box("architecture", gray, 4.15, 3.88, z, 2.75, .23, .1);
  for (const x of [3.34, 4.22]) {
    box("roof", "#aaab9a", x, 3.835, -10.21, .55, .018, .76);
    box("architecture", "#a7ada3", x, 3.99, -10.21, .42, .29, .53);
    add("wood", new CylinderGeometry(.13, .13, .018, 12), "#606f66", x, 4.143, -10.21);
  }
  smallCar(3.46, -10.37, "#a0aaa5");
  for (let n = 0; n < 11; n++) box("wood", "#a49e88", 5.64, .25, -11.31 + n * .25, .035, .43, .035);
  pole(new Vector3(5.64, .3, -11.31), new Vector3(5.64, .3, -8.81), .012, "#aaa28d");
  palm(5.51, -8.31, 90112, true);

  // Raised tan home across the approach, with paired stairs and the round window.
  const tx = 3.9, tz = -16.2;
  box("ground", "#c5b5a0", tx, .045, -14.24, 2.14, .055, 2.8);
  box("architecture", "#b7ad95", tx, .48, tz - .24, 1.45, .88, 1.86);
  box("architecture", "#b6ae97", tx, 2.025, tz, 1.98, 2.11, 2.5);
  for (const x of [2.98, 3.9, 4.82]) for (const z of [-17.38, -15]) box("architecture", "#e3ddc8", x, .53, z, .095, 1.02, .11);
  for (let line = 0; line < 23; line++) {
    box("wood", "#c6bea7", 4.903, 1.01 + line * .09, tz, .012, .009, 2.44);
    box("wood", "#c6bea7", tx, 1.01 + line * .09, -14.939, 1.91, .009, .012);
  }
  box("roof", "#bcb9a7", tx, 3.13, tz, 2.16, .12, 2.68);
  for (const y of [1.55, 2.51]) for (const x of [3.4, 4.37]) frontWindow(x, y, -14.929, .48, .58);
  add("architecture", new CircleGeometry(.145, 24).rotateY(Math.PI / 2), cream, 4.913, 2.77, tz);
  add("glass", new CircleGeometry(.12, 24).rotateY(Math.PI / 2), "#91aba4", 4.924, 2.77, tz);
  box("wood", "#b49d7a", tx, 1.12, -14.74, 2.03, .1, .43);
  for (const x of [3.02, 4.78]) pole(new Vector3(x, .06, -14.58), new Vector3(x, 1.18, -14.58), .035, "#b8ab8f");
  rail(new Vector3(3.02, 1.18, -14.51), new Vector3(3.69, 1.18, -14.51));
  rail(new Vector3(4.11, 1.18, -14.51), new Vector3(4.78, 1.18, -14.51));
  box("wood", "#c8b598", tx, 1.12, -14.48, .46, .1, .32);
  for (const side of [-1, 1]) {
    for (let n = 0; n < 8; n++) {
      const y = (n + 1) * 1.12 / 8;
      box("wood", "#b49b7a", tx + side * (.94 - n * .11), y / 2, -14.3, .14, y, .37);
    }
    for (const end of [-1, 1]) pole(new Vector3(tx + side * .99, .36, -14.3 + end * .2), new Vector3(tx + side * .14, 1.45, -14.3 + end * .2), .018, cream);
  }
  for (let n = 0; n < 7; n++) {
    const z = -17.05 + n * .21;
    pole(new Vector3(4.847, .12, z), new Vector3(4.847, .72, z + .47), .012, cream);
    pole(new Vector3(4.855, .72, z), new Vector3(4.855, .12, z + .47), .012, cream);
  }
  smallCar(3.55, -13.48, "#91b0b7");
  smallCar(4.35, -13.48, "#dadbd0");

  // Blue coastal home, with mixed roof shapes, open parking and a raised porch.
  const bx = 1.55, bz = -10;
  box("ground", "#c5c5b6", bx, .045, bz, 2.12, .055, 4.02);
  box("architecture", "#bad3d1", bx, 1.82, bz, 1.72, 2.06, 2.5);
  box("architecture", "#73a9b7", bx, 2.49, bz, 1.73, .7, 2.51);
  for (const x of [.77, 1.55, 2.33]) for (const z of [-11.15, -8.84]) box("architecture", cream, x, .45, z, .13, .82, .14);
  roof(bx, 2.88, bz, 1.93, 2.72, .37, "#c1ceca");
  box("architecture", "#80afba", 1.15, 3.02, -10.35, .59, .64, .72);
  roof(1.15, 3.36, -10.35, .78, .92, .16, "#c8d1ca");
  frontWindow(1.15, 3.05, -10.726, .32, .4);
  for (const y of [1.43, 2.37]) for (const x of [1.12, 1.99]) frontWindow(x, y, -11.273, .45, .61);
  box("wood", "#d8d3bd", bx, 1.035, -11.45, 1.91, .09, .55);
  for (const x of [.7, 2.4]) pole(new Vector3(x, .07, -11.67), new Vector3(x, 1.95, -11.67), .045, cream, "architecture");
  rail(new Vector3(.72, 1.09, -11.7), new Vector3(2.39, 1.09, -11.7));
  box("roof", "#baccc5", bx, 1.98, -11.47, 2.03, .08, .76);
  smallCar(1.1, -10.81, "#536975");
  smallCar(2.0, -10.81, "#d0d3c5");
  for (let n = 0; n < 9; n++) {
    const y = (n + 1) * 1.04 / 9;
    box("wood", cream, .44, y / 2, -10.05 - n * .135, .35, y, .155);
  }
  pole(new Vector3(.24, .4, -10.04), new Vector3(.24, 1.38, -11.2), .018, cream);
  box("wood", cream, .56, 1.035, -11.29, .59, .09, .3);
  palm(2.6, -8.4, 90123, true);

  // The neighboring narrow work site keeps its missing walls and unfinished slabs.
  const ux = -.8;
  box("ground", "#b7ad8f", ux, .036, -10.1, 2.03, .05, 3.03);
  for (const x of [-1.57, -.8, -.03]) for (const z of [-11.13, -8.87]) box("architecture", "#a9aaa0", x, .56, z, .12, 1.02, .12);
  for (const y of [1.08, 2.08, 3.08]) {
    box("wood", "#b3a483", ux, y, -10, 1.78, .1, 2.53);
    box("architecture", "#c6c9b9", ux, y, -11.36, 1.86, .12, .61);
  }
  box("architecture", "#7a9b5e", -1.56, 2.08, -10, .09, 1.92, 2.44);
  box("architecture", "#9d694e", -.06, 1.54, -10, .09, .93, 2.44);
  box("architecture", "#82a567", -.06, 2.56, -10, .09, .91, 2.44);
  box("architecture", "#adbda0", ux, 2.08, -8.82, 1.63, 1.93, .09);
  for (const y of [1.6, 2.6]) for (const x of [-1.57, -.8, -.03]) box("wood", "#b6a17b", x, y, -11.15, .07, .96, .09);
  box("architecture", "#e0e1d6", -1.62, 2.59, -10, .07, .93, 2.4);
  for (let n = 0; n < 13; n++) box("wood", "#c9cec0", -1.663, 2.59, -11.13 + n * .187, .01, .91, .012);
  box("roof", "#52605c", ux, 3.17, -10, 1.91, .11, 2.66);
  // Roll-off with open top, rails, debris and a few grounded lengths of lumber.
  box("wood", "#905d4a", ux, .12, -11.69, 1.2, .12, .42);
  for (const x of [-1.37, -.23]) box("wood", "#a36b52", x, .31, -11.69, .06, .31, .45);
  for (const z of [-11.88, -11.5]) box("wood", "#985e47", ux, .31, z, 1.2, .31, .055);
  for (let n = 0; n < 8; n++) box("wood", n % 2 ? "#b7a37d" : "#8d927d", -1.25 + n * .13, .28 + n % 3 * .05, -11.69, .2, .11, .25, n * .19);
  for (let n = 0; n < 5; n++) box("wood", "#b9a179", -.75 + n * .09, .076 + n * .012, -8.55, .055, .025, .8, n * .12);

  // Smaller cottage with a timber upper deck, striped awnings and garden pots.
  box("ground", "#adae90", -3.15, .027, -10, 2.16, .04, 4.0);
  box("architecture", "#c3c1aa", -3.15, 1.0, -10, 1.9, 1.92, 2.55);
  roof(-3.15, 2.0, -10, 2.12, 2.73, .31, "#a9b2a5", 2);
  for (const x of [-3.59, -2.72]) for (const y of [.56, 1.52]) frontWindow(x, y, -11.292, .43, .59);
  box("wood", "#8c795c", -3.15, 1.08, -11.48, 2.02, .09, .45);
  for (const x of [-4.07, -2.23]) pole(new Vector3(x, .04, -11.57), new Vector3(x, 1.45, -11.57), .03, "#927d5f");
  for (const y of [1.16, 1.31, 1.45]) box("wood", "#806c51", -3.15, y, -11.72, 2.02, .055, .045);
  for (const x of [-3.59, -2.72]) for (let stripe = 0; stripe < 7; stripe++) box("roof", stripe % 2 ? "#c9cba8" : "#eee8d4", x - .28 + stripe * .08, 1.88, -11.37, .08, .045, .32);
  for (let n = 0; n < 4; n++) {
    add("architecture", new CylinderGeometry(.065, .047, .13, 10), n % 2 ? "#96a66b" : "#bca57a", -3.7 + n * .32, .13, -11.5);
    bush(-3.7 + n * .32, -11.5, 90310 + n, .11);
  }
  // A single layered-branch silhouette complements the palms near the inland end.
  pole(new Vector3(-4.55, .03, -8.65), new Vector3(-4.55, 3.4, -8.65), .035, "#8e8469");
  for (let tier = 0; tier < 9; tier++) {
    const radius = .74 * (1 - tier / 11), y = .65 + tier * .3;
    add("foliage", new ConeGeometry(radius, .22, 13), tier % 2 ? "#3d6548" : "#496c48", -4.55, y, -8.65, tier * .8);
  }
  // A small warm flower bed on Castillo's other frontage catches the evening light.
  const bed = new CylinderGeometry(.49, .51, .045, 18); bed.scale(.55, 1, 1);
  add("ground", bed, "#9c8a70", -4.46, .055, 1.72);
  for (let n = 0; n < 24; n++) {
    const angle = n * 2.4, radius = .12 + n % 5 * .065;
    const bloom = new IcosahedronGeometry(.035, 0);
    add("foliage", bloom, n % 6 === 0 ? "#e2dfbe" : "#b96d69", -4.46 + Math.cos(angle) * radius * .55, .14 + n % 3 * .025, 1.72 + Math.sin(angle) * radius);
  }
}
