import { CatmullRomCurve3, CircleGeometry, CylinderGeometry, IcosahedronGeometry, Shape, ShapeGeometry, TubeGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";
import { signLettering } from "./sign-lettering";

/** Fictional Ethel's diner, photo-guided by Obi's at the A1A/7th Lane corner. */
export function buildEthelFillingStation(kit: CastilloKit) {
  const { box, add, pole, palm, bush } = kit;
  const cream = "#ebe9d5", green = "#53885e", lime = "#a0bd73", ink = "#364842";
  const frontage = -4.3, lane = 25, north = 26.3;
  box("ground", "#c9c0a8", -2.85, .04, 28.05, 4.15, .07, 4.45);
  box("ground", "#dbd0b7", -4.64, .084, 28.05, .68, .055, 4.4);
  box("architecture", cream, -2.95, .67, 27.5, 2.7, 1.25, 2.4);
  box("architecture", cream, -2.5, .98, 29.3, 3.1, 1.85, 1.8);
  for (const [x, z, w, d, h] of [[-2.95, 27.5, 2.88, 2.55, 1.33], [-2.5, 29.3, 3.27, 1.95, 1.96]]) {
    box("roof", "#c1c4b1", x, h, z, w, .075, d);
    for (const px of [x - w / 2, x + w / 2]) {
      box("architecture", cream, px, h + .08, z, .065, .13, d);
      box("roof", green, px, h + .158, z, .085, .037, d + .03);
    }
    for (const pz of [z - d / 2, z + d / 2]) {
      box("architecture", cream, x, h + .08, pz, w, .13, .065);
      box("roof", green, x, h + .158, pz, w + .03, .037, .085);
    }
  }
  // Pale and green horizontal bands tie the lower shop to the raised diner end.
  box("architecture", green, frontage - .025, .24, 27.5, .07, .065, 2.4);
  box("architecture", lime, frontage - .035, .33, 27.5, .08, .05, 2.4);
  box("architecture", green, -4.083, 1.42, 29.3, .065, .065, 1.8);
  box("architecture", green, -4.083, .25, 29.3, .065, .06, 1.8);
  box("architecture", green, -2.95, .24, north - .015, 2.7, .065, .055);

  // Rounded projecting entry bay, with a wrapped DINER band above its tall window.
  const roundX = -4.09, roundZ = 28.62, radius = .435;
  add("architecture", new CylinderGeometry(radius, radius, 1.93, 40), cream, roundX, 1.01, roundZ);
  for (const [y, color, h] of [[.3, green, .065], [1.35, green, .075], [1.9, green, .075]] as const) {
    add("architecture", new CylinderGeometry(radius + .025, radius + .025, h, 40), color, roundX, y, roundZ);
  }
  add("architecture", new CylinderGeometry(radius + .007, radius + .007, .42, 40), ink, roundX, 1.63, roundZ);
  const diner = signLettering("DINER", 1.0, .006);
  const positions = diner.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const angle = positions.getX(i) / (radius + .015), depth = positions.getZ(i);
    positions.setXYZ(i, Math.sin(angle) * (radius + .015 + depth), positions.getY(i), Math.cos(angle) * (radius + .015 + depth) - radius);
  }
  diner.computeVertexNormals();
  add("architecture", diner, "#f5efdc", roundX - radius, 1.64, roundZ, -Math.PI / 2);
  box("architecture", "#f4eedc", roundX - radius - .018, .79, roundZ, .04, .85, .31);
  box("glass", "#476b78", roundX - radius - .044, .79, roundZ, .027, .75, .24);

  const westWindow = (z: number, w: number) => {
    box("architecture", lime, frontage - .026, .66, z, .046, .72, w + .12);
    box("architecture", "#f3edda", frontage - .052, .66, z, .037, .62, w + .055);
    box("glass", "#466f78", frontage - .077, .66, z, .025, .55, w);
    box("architecture", "#edebd8", frontage - .094, .67, z, .017, .025, w);
    for (const offset of [-w / 4, w / 4]) box("architecture", "#edebd8", frontage - .092, .66, z + offset, .017, .55, .018);
    // Thin pale blinds only at the upper window margin, leaving glazing readable.
    for (let n = 0; n < 4; n++) box("wood", "#bfc9b7", frontage - .095, .865 + n * .011, z, .012, .004, w);
  };
  westWindow(26.96, .79); westWindow(28.02, .65);
  for (const x of [-3.53, -2.63]) {
    box("architecture", lime, x, .65, north - .025, .74, .74, .035);
    box("glass", "#527a85", x, .65, north - .051, .61, .61, .025);
    box("architecture", cream, x, .65, north - .067, .019, .61, .018);
  }
  // Actual glazed entry on the taller end, with a green handrail and a clear ramp.
  box("architecture", green, -4.079, .64, 29.5, .055, .94, .39);
  box("glass", "#354e56", -4.115, .65, 29.5, .025, .8, .3);
  box("wood", cream, -4.137, .55, 29.62, .018, .055, .019);
  box("ground", "#cfbea0", -4.55, .118, 29.5, .79, .07, .64);
  for (const z of [29.16, 29.84]) {
    for (const x of [-4.84, -4.29]) pole(new Vector3(x, .14, z), new Vector3(x, .5, z), .014, green);
    pole(new Vector3(-4.84, .5, z), new Vector3(-4.29, .5, z), .017, green);
  }

  const oval = (x: number, y: number, z: number, width: number, turn: number) => {
    const board = new CircleGeometry(.5, 40).scale(width, width * .5, 1);
    add("wood", board.clone(), ink, x, y, z, turn);
    const outward = new Vector3(0, 0, .008).applyAxisAngle(new Vector3(0, 1, 0), turn);
    add("architecture", board.scale(.93, .88, 1), "#e8d294", x + outward.x, y, z + outward.z, turn);
    add("architecture", signLettering("Ethel's", width * .63, .006), "#aa5960", x + outward.x * 2, y + width * .055, z + outward.z * 2, turn);
    add("architecture", signLettering("FILLING STATION", width * .66, .004), "#655b4c", x + outward.x * 2, y - width * .15, z + outward.z * 2, turn);
  };
  oval(frontage - .12, 1.09, 27.5, 1.04, -Math.PI / 2);
  oval(-2.15, 1.48, 30.245, 1.0, 0);
  add("architecture", signLettering("BREAKFAST", 1.04), "#615444", -3.32, 1.12, north - .045, Math.PI);
  for (const z of [26.54, 27.14, 27.98, 29.08, 29.86]) {
    const wallX = z > 28.7 ? -4.11 : frontage - .11;
    box("wood", "#828b76", wallX, .985, z, .085, .08, .075);
    add("glass", new IcosahedronGeometry(.041, 1), "#cbb888", wallX - .031, .97, z);
  }

  // Original colorful abstract wall art: bright shapes, petals and dots, with no
  // copied artist lettering or photograph used as a facade texture.
  const colors = ["#d4bc6a", "#bc708e", "#74a6b2", "#a995b4", "#81a877", "#c8806a"];
  box("architecture", "#d4bc6a", frontage - .029, 1.14, 27.5, .012, .25, 2.36);
  // Keep paint behind the oval and windows; these broad panels carry the mural
  // colors at neighborhood scale as well as in a future street-level banner.
  box("architecture", "#d4bc6a", -2.91, 1.12, north - .027, 2.64, .21, .016);
  box("architecture", "#bc708e", -1.88, .61, north - .031, .45, .92, .018);
  for (let n = 0; n < 7; n++) {
    const shape = new Shape(); shape.moveTo(-.21, -.11); shape.lineTo(.19, -.18); shape.lineTo(.24, .06); shape.lineTo(-.12, .22); shape.closePath();
    add("architecture", new ShapeGeometry(shape), colors[n % colors.length], -1.92, .27 + n * .12, north - .046, Math.PI);
  }
  for (let n = 0; n < 8; n++) box("architecture", colors[n % colors.length], -3.79 + n * .38, 1.66, 30.217, .39, .46, .012);
  for (let n = 0; n < 23; n++) {
    const x = -4.15 + n % 8 * .31, y = .18 + Math.floor(n / 8) * .035;
    const flower = new CircleGeometry(.105, n % 2 ? 7 : 12).scale(1, .7, 1);
    add("architecture", flower, colors[n % colors.length], x, y, north - .037, Math.PI);
  }
  for (let n = 0; n < 18; n++) {
    const z = 26.44 + n * .208;
    add("architecture", new CircleGeometry(.089, n % 3 ? 9 : 5), colors[n % colors.length], (z > 28.5 ? -4.09 : frontage) - .063, .16, z, -Math.PI / 2);
  }
  for (let n = 0; n < 6; n++) {
    const shape = new Shape(); shape.moveTo(-.17, -.1); shape.lineTo(.2, -.08); shape.lineTo(.12, .2); shape.lineTo(-.14, .13); shape.closePath();
    add("architecture", new ShapeGeometry(shape), colors[n % colors.length], -2.92 + n * .33, 1.63, 30.21);
  }

  // Two old-fashioned display pumps and a small red pump between them.
  const pump = (z: number, black: boolean) => {
    const x = -4.67;
    box("wood", "#535d50", x, .11, z, .28, .055, .29);
    box("architecture", "#5f956b", x, .43, z, .22, .58, .23);
    box("architecture", black ? "#394b43" : "#5b9b68", x, .62, z, .24, .3, .25);
    box("architecture", "#e8e1c5", x - .126, .65, z, .014, .18, .14);
    box("wood", "#5e6d60", x - .139, .676, z, .009, .045, .091);
    for (let digit = 0; digit < 4; digit++) box("wood", "#747e69", x - .14, .613, z - .043 + digit * .027, .007, .018, .012);
    pole(new Vector3(x, .76, z), new Vector3(x, .825, z), .017, ink);
    add("architecture", new CircleGeometry(.096, 28).rotateY(-Math.PI / 2), black ? "#364a40" : "#e0ead4", x - .012, .88, z);
    add("architecture", new CircleGeometry(.067, 24).rotateY(-Math.PI / 2), black ? "#d7bd79" : "#77a287", x - .02, .88, z);
    const hose = new CatmullRomCurve3([new Vector3(x, .69, z + .15), new Vector3(x + .09, .5, z + .22), new Vector3(x + .03, .2, z + .19), new Vector3(x - .1, .28, z + .15), new Vector3(x - .13, .54, z + .14)]);
    add("wood", new TubeGeometry(hose, 24, .009, 5, false), "#354b42", 0, 0, 0);
  };
  pump(27.23, false); pump(27.83, true);
  pole(new Vector3(-4.67, .12, 27.53), new Vector3(-4.67, .48, 27.53), .022, "#bb7865");
  box("architecture", "#c07865", -4.67, .51, 27.53, .095, .14, .12);
  box("architecture", "#e7d5af", -4.723, .515, 27.53, .014, .081, .074);

  const picnic = (x: number, z: number, color: string) => {
    box("wood", color, x, .29, z, .48, .04, .68);
    for (let n = 0; n < 4; n++) box("wood", "#668e66", x, .313, z - .27 + n * .18, .47, .006, .007);
    for (const side of [-1, 1]) {
      box("wood", color, x + side * .3, .18, z, .13, .032, .69);
      for (const end of [-1, 1]) pole(new Vector3(x + side * .28, .08, z + end * .22), new Vector3(x + side * .1, .27, z + end * .22), .022, color);
    }
  };
  picnic(-4.69, 26.52, "#659b69"); picnic(-2.25, 30.58, "#6c9ead");
  // Roadside brand post and a small chalkboard leave the doorway unobstructed.
  pole(new Vector3(-4.81, .09, 30.12), new Vector3(-4.81, 1.72, 30.12), .025, cream);
  box("wood", "#bca170", -4.83, 1.55, 30.12, .065, .49, .84);
  oval(-4.87, 1.57, 30.12, .76, -Math.PI / 2);
  box("wood", cream, -4.86, .33, 30.66, .07, .39, .29);
  box("wood", "#35463f", -4.903, .33, 30.66, .018, .34, .25);
  add("architecture", signLettering("EAT HERE", .215), "#e8e3ce", -4.918, .35, 30.66, -Math.PI / 2);
  for (const z of [30.54, 30.78]) pole(new Vector3(-4.98, .1, z), new Vector3(-4.86, .52, z), .016, cream);
  // Roof pickup is a sculpture on a small stand, separate from street vehicles.
  const carX = -2.42, carZ = 29.23, wheelY = 2.22;
  for (const z of [carZ - .39, carZ + .39]) for (const side of [-1, 1]) {
    add("wood", new CylinderGeometry(.14, .14, .045, 20).rotateZ(Math.PI / 2), "#38463e", carX + side * .29, wheelY, z);
    add("architecture", new CylinderGeometry(.105, .105, .048, 20).rotateZ(Math.PI / 2), "#e0deca", carX + side * .298, wheelY, z);
    add("architecture", new CylinderGeometry(.057, .057, .052, 16).rotateZ(Math.PI / 2), "#9b7464", carX + side * .303, wheelY, z);
    pole(new Vector3(carX + side * .21, 2.01, z), new Vector3(carX + side * .21, 2.2, z), .025, ink);
  }
  box("architecture", "#3c4941", carX, 2.31, carZ, .54, .22, 1.14);
  box("architecture", "#3c4941", carX, 2.46, carZ + .36, .54, .16, .45);
  box("wood", "#6a7568", carX, 2.55, carZ + .36, .4, .013, .31);
  box("glass", "#6d8b89", carX, 2.54, carZ - .1, .43, .24, .38);
  box("roof", "#38473f", carX, 2.68, carZ - .1, .49, .055, .43);
  for (const side of [-1, 1]) {
    box("architecture", "#ba8b7a", carX + side * .278, 2.34, carZ - .18, .023, .12, .36);
    box("architecture", "#dedabd", carX + side * .18, 2.31, carZ - .58, .12, .079, .025);
  }
  box("wood", "#aab4a4", carX, 2.215, carZ - .61, .58, .045, .04);
  box("architecture", "#afb5a3", -1.56, 2.12, 29.68, .34, .24, .39);

  // Palm roots and fence remain on the parcel, keeping the A1A sidewalk and lane clear.
  for (const [x, z] of [[-4.75, 26.01], [-4.82, 28.51], [-.75, 27.18]]) palm(x, z, 9700 + Math.round(z * 10), true);
  for (const [x, z] of [[-4.87, 27.03], [-1.18, 26.49], [-1.18, 29.96]]) bush(x, z, 9751 + Math.round(z), .14);
  for (let n = 0; n < 17; n++) box("wood", "#639665", -.71, .38, 26.33 + n * .22, .045, .62, .20);
  for (const z of [26.5, 29.5]) {
    box("ground", "#d3c5a9", -1.2, .073, z, .65, .028, .15);
    box("wood", "#8c826e", -1.2, .24, z, .21, .32, .23);
  }
  // Keep an actual narrow service approach beside the shop.
  box("ground", "#9da290", -2.65, .066, lane + .89, 4.45, .025, .37);
}
