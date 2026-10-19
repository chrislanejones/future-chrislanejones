import { BufferAttribute, BufferGeometry, CatmullRomCurve3, CylinderGeometry, IcosahedronGeometry, Shape, ShapeGeometry, TubeGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";
import { signLettering, type CoastSignText } from "./sign-lettering";

/** Details that read at walking height along the eastbound 9th Street approach. */
export function buildNinthStreetDetail(kit: CastilloKit) {
  const { box, pole, add, bush } = kit;
  const streetZ = 3.4, west = -5.54, east = 6.12;
  const green = "#377b66", cream = "#e9dec5";
  box("ground", "#b8b49e", (west + east) / 2, .086, streetZ, east - west, .05, 1.05);
  box("ground", "#8e9490", (west + east) / 2, .117, streetZ, east - west, .024, .85);
  // Yellow paint ends where the narrow beach approach becomes unmarked.
  for (const z of [3.365, 3.435]) box("ground", "#dfc779", -4.29, .134, z, 2.5, .01, .025);
  for (const z of [2.885, 3.915]) {
    const front = z < streetZ ? -1 : 1;
    const curve = new CatmullRomCurve3([
      new Vector3(-5.5, .147, z + front * .23),
      new Vector3(-4.78, .147, z + front * .035),
      new Vector3(-3.85, .147, z), new Vector3(-.5, .147, z),
      new Vector3(2.8, .147, z), new Vector3(6.07, .147, z),
    ]);
    add("ground", new TubeGeometry(curve, 80, .033, 5, false), cream, 0, 0, 0);
  }
  // Paver crossing, drains, repair seams and a small utility cover are physical detail.
  box("ground", "#bfad91", -.42, .137, streetZ, .39, .012, .84);
  for (let n = 0; n < 7; n++) box("ground", "#a7957e", -.42, .146, 3.045 + n * .12, .39, .007, .008);
  for (const x of [-4.34, 1.72]) {
    box("wood", "#4f5953", x, .142, 3.805, .17, .011, .085);
    for (let n = 0; n < 5; n++) box("wood", "#93988a", x - .064 + n * .032, .15, 3.805, .009, .009, .075);
  }
  add("wood", new CylinderGeometry(.07, .07, .008, 20), "#797f73", -2.68, .139, 3.67);
  pole(new Vector3(.77, .136, 3.12), new Vector3(1.34, .136, 3.3), .006, "#777e75", "ground");

  const plaque = (text: CoastSignText, x: number, y: number, z: number, w: number, h: number, color: string, ink: string) => {
    // The sign faces west toward the arriving walker, with a pale rim and real lettering.
    box("architecture", cream, x, y, z, .018, h, w);
    box("architecture", color, x - .013, y, z, .015, h - .026, w - .026);
    add("architecture", signLettering(text, w * .86), ink, x - .025, y, z, -Math.PI / 2);
  };
  pole(new Vector3(-4.85, .12, 2.59), new Vector3(-4.85, 1.28, 2.59), .018, "#999d8c");
  plaque("9th St", -4.86, 1.22, 2.59, .46, .135, green, "#f6f2e0");
  plaque("A1A Beach Blvd", -4.86, 1.04, 2.59, .48, .13, green, "#f6f2e0");

  pole(new Vector3(-4.62, .12, 4.15), new Vector3(-4.62, 1.09, 4.15), .017, "#a5a899");
  box("architecture", "#f2eee0", -4.62, .91, 4.15, .023, .43, .3);
  for (const [text, y, w] of [["SPEED", 1.06, .24], ["LIMIT", .958, .2], ["25", .79, .205]] as const) {
    add("wood", signLettering(text, w), "#334840", -4.644, y, 4.15, -Math.PI / 2);
  }
  for (const [text, x, z] of [["LOBBY", -3.58, 2.62], ["PARKING", -3.27, 4.15], ["ENTER", -4.15, 2.62]] as const) {
    box("architecture", "#ece8d5", x, .25, z, .13, .35, .15);
    plaque(text, x - .08, .49, z, .45, .17, "#f8f0db", "#87484b");
    pole(new Vector3(x - .11, .442, z - .145), new Vector3(x - .11, .442, z + .14), .007, "#934f53");
  }

  // Compact yellow crossing sign. Its walking pictogram is geometry, not a map pin.
  pole(new Vector3(-5.1, .12, 2.1), new Vector3(-5.1, 1.09, 2.1), .018, "#949d8a");
  const diamond = new Shape(); diamond.moveTo(0, .21); diamond.lineTo(.22, 0); diamond.lineTo(0, -.21); diamond.lineTo(-.22, 0); diamond.closePath();
  add("architecture", new ShapeGeometry(diamond), "#cfdb69", -5.12, .98, 2.1, -Math.PI / 2);
  const at = (h: number, side: number) => new Vector3(-5.135, h, 2.1 + side);
  add("wood", new IcosahedronGeometry(.027, 1), "#394b3c", -5.139, 1.095, 2.09);
  pole(at(1.047, -.005), at(.96, -.008), .024, "#394b3c");
  pole(at(1.025, -.01), at(.98, -.065), .014, "#394b3c");
  pole(at(1.025, .01), at(.973, .06), .014, "#394b3c");
  pole(at(.96, -.008), at(.875, -.055), .016, "#394b3c");
  pole(at(.96, -.008), at(.881, .044), .016, "#394b3c");

  // Dense low planting remains outside the continuous roadway and hotel pool wall.
  for (const side of [-1, 1]) for (let n = 0; n < 22; n++) {
    const x = -4.55 + n * .35, z = streetZ + side * (.72 + .075 * Math.sin(n * 2.3));
    if (side < 0 && x > .4) continue;
    bush(x, z, 9100 + n + (side + 1) * 33, .13 + n % 3 * .035);
    for (let petal = 0; petal < 4; petal++) add("foliage", new IcosahedronGeometry(.023, 0),
      ["#b86967", "#d5b177", "#e6d6ab"][n % 3], x + Math.sin(petal * 2.4) * .12, .13 + petal % 2 * .04, z + Math.cos(petal * 2.4) * .1);
  }
  // Close palms have separated leaflets and fan blades, rather than large solid
  // ribbons. They keep the same scale and batched materials as the wider town.
  const closePalm = (x: number, z: number, height: number, seed: number, feather = false) => {
    const top = new Vector3(x + .075 * Math.sin(seed), height, z + .09 * Math.cos(seed));
    pole(new Vector3(x, .13, z), top, feather ? .085 : .044, "#998971");
    for (let n = 0; n < Math.floor(height / .08); n++) {
      const t = n / Math.floor(height / .08);
      const p = new Vector3(x, .13, z).lerp(top, t);
      add("wood", new CylinderGeometry(feather ? .088 : .048, feather ? .096 : .052, .015, 8), n % 3 ? "#9b8f78" : "#847d68", p.x, p.y, p.z);
    }
    const vertices: number[] = [];
    const triangle = (a: Vector3, b: Vector3, c: Vector3) => vertices.push(...a.toArray(), ...b.toArray(), ...c.toArray());
    for (let frond = 0; frond < 18; frond++) {
      const angle = frond * Math.PI * 2 / 18 + seed * .1;
      const length = (feather ? 1.13 : .62) * (1 + .17 * Math.sin(frond * 4.7 + seed));
      const direction = new Vector3(Math.cos(angle), 0, Math.sin(angle));
      const across = new Vector3(-direction.z, 0, direction.x);
      const spine = (t: number) => top.clone().addScaledVector(direction, t * length).add(new Vector3(0, Math.sin(t * Math.PI) * .24 - t * t * .38, 0));
      pole(spine(0), spine(.5), .008, "#8a9763");
      pole(spine(.5), spine(1), .005, "#8a9763");
      if (feather) {
        for (let leaflet = 1; leaflet < 20; leaflet++) for (const side of [-1, 1]) {
          const t = leaflet / 21, base = spine(t);
          const tip = base.clone().addScaledVector(across, side * Math.sin(t * Math.PI) * .23).addScaledVector(direction, .09);
          tip.y -= .03 + .05 * t;
          triangle(base, tip, spine(t + .025));
        }
      } else {
        const root = spine(.3), fan = spine(.58);
        for (let blade = 0; blade < 13; blade++) {
          const t = blade / 12 - .5;
          const tip = spine(1).addScaledVector(across, Math.sin(t * Math.PI) * .28);
          tip.y += Math.cos(t * Math.PI) * .065;
          triangle(root, fan.clone().addScaledVector(across, t * .17), tip);
          triangle(root, tip, fan.clone().addScaledVector(across, t * .17 + .017));
        }
      }
    }
    const leaves = new BufferGeometry();
    leaves.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3)); leaves.computeVertexNormals();
    add("foliage", leaves, feather ? "#758557" : "#7c8f5f", 0, 0, 0);
  };
  closePalm(-4.37, 1.5, 1.9, 92, true);
  for (const [x, z, h] of [[-1.7, 2.28, 2.65], [-.9, 2.42, 3.6], [.15, 2.49, 3.04], [1.21, 4.17, 2.77], [3.14, 4.15, 3.26], [-3.6, 4.64, 2.62]]) closePalm(x, z, h, 9205 + Math.round(x * 11));
  for (const [x, z] of [[-3.3, 2.5], [-1.06, 4.08], [1.45, 2.57], [3.0, 4.07]]) {
    // Tall green ornamental lanterns bracket the way toward the beach.
    add("wood", new CylinderGeometry(.06, .08, .06, 8), green, x, .17, z);
    pole(new Vector3(x, .17, z), new Vector3(x, 1.41, z), .018, green);
    add("glass", new CylinderGeometry(.046, .065, .15, 6), "#d7c790", x, 1.5, z);
    add("roof", new CylinderGeometry(0, .083, .06, 6), green, x, 1.608, z);
    for (const turn of [0, Math.PI / 2]) box("wood", green, x, 1.5, z, .012, .19, .13, turn);
  }
  // A low yellow hydrant at the entry corner.
  add("architecture", new CylinderGeometry(.048, .058, .2, 10), "#d9ba6c", -4.47, .24, 2.21);
  add("architecture", new CylinderGeometry(0, .06, .065, 10), "#e3c877", -4.47, .373, 2.21);
  box("architecture", "#d0b062", -4.47, .285, 2.21, .15, .055, .065);
}
