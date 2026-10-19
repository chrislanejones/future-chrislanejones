import {
  BufferAttribute, BufferGeometry, CylinderGeometry, Shape, ShapeGeometry, Vector3,
} from "three";

type Layer = "architecture" | "roof" | "glass" | "ground" | "foliage" | "wood" | "water";
export type CastilloKit = {
  box: (layer: Layer, color: string, x: number, y: number, z: number, w: number, h: number, d: number, turn?: number) => void;
  roof: (x: number, y: number, z: number, w: number, d: number, rise: number, color: string, variant?: number) => void;
  pole: (a: Vector3, b: Vector3, radius: number, color: string, layer?: Layer) => void;
  add: (layer: Layer, geometry: BufferGeometry, color: string, x: number, y: number, z: number, rotation?: number) => void;
  palm: (x: number, z: number, seed: number, small?: boolean) => void;
  bush: (x: number, z: number, seed: number, size?: number) => void;
  parkingRow: (x: number, z: number, count: number, seed: number, facing?: number, surface?: string) => void;
};

/** Photo-guided landmark with an equipment roof and different street/pool facades. */
export function buildCastilloReal(kit: CastilloKit) {
  const { box, roof, pole, add, palm, bush, parkingRow } = kit;
  const cream = "#eee7d5", pale = "#f5eddb", taupe = "#aaa390";
  const tile = "#bb8068", rail = "#4b514c", glass = "#516c70";
  const membrane = "#bcb9aa", paving = "#c6b29a";

  // West is A1A. The body sits back from the drive; its pool court faces east.
  box("ground", paving, -.65, .026, -.25, 8.1, .05, 7.6);
  box("ground", "#d2bca3", -4.28, .07, -.55, 1.04, .055, 6.5);
  for (let i = 0; i < 11; i++) box("ground", "#b8a48d", -4.28, .101, -3.48 + i * .58, 1.03, .009, .012);
  box("architecture", cream, -2.075, 2.24, -1.3, 3.45, 4.4, 4.1);
  box("architecture", "#b6ad98", -2.075, .17, -1.3, 3.5, .26, 4.14);

  // Shallow front projections and contrasting infill do not conceal the flat roof.
  for (const z of [-2.82, -1.65, -.48]) {
    box("architecture", taupe, -3.82, 2.29, z, .07, 4.24, .88);
    for (const edge of [-1, 1]) box("architecture", pale, -3.89, 2.31, z + edge * .49, .18, 4.3, .12);
  }
  for (const z of [-2.22, -.99]) {
    box("architecture", cream, -3.96, 2.36, z, .33, 4.4, .4);
    roof(-3.92, 4.58, z, .55, .62, .2, tile, 2);
  }

  const windowOnX = (x: number, y: number, z: number, width: number, height: number) => {
    box("architecture", "#d9ceb7", x, y, z, .04, height + .12, width + .11);
    box("glass", glass, x - .027, y, z, .025, height, width);
    box("architecture", pale, x - .055, y - height / 2 - .045, z, .1, .065, width + .15);
    box("wood", "#8a958b", x - .044, y, z, .028, height, .024);
  };
  for (let floor = 0; floor < 4; floor++) {
    const y = .61 + floor * 1.025;
    for (const z of [-2.82, -1.65, -.48]) windowOnX(-3.885, y, z, .44, .55);
    for (const z of [-2.22, -.99]) windowOnX(-4.135, y, z, .24, .57);
    // End walls carry mostly shallow window rails, rather than deep rear balconies.
    for (const end of [-3.375, .775]) for (const x of [-3.12, -2.25, -1.38]) {
      box("architecture", "#dacfb9", x, y, end, .54, .65, .035);
      box("glass", glass, x, y, end + (end > 0 ? .025 : -.025), .42, .54, .03);
      if (floor > 0 && end > 0) {
        box("wood", rail, x, y - .05, end + .09, .48, .03, .035);
        for (let n = 0; n < 5; n++) box("wood", rail, x - .2 + n * .1, y - .17, end + .1, .018, .26, .025);
      }
    }
  }
  for (const y of [1.22, 3.3]) roof(-3.96, y, -1.65, .32, 1.02, .075, tile);
  for (const x of [-2.48, -2.2, -1.92]) box("architecture", taupe, x, 3.87, .805, .15, .83, .12);

  // True balcony recesses: back wall, projecting slabs, uprights and open railings.
  for (const z of [-2.68, -.02]) {
    box("architecture", "#cfc6b4", -.275, 2.25, z, .15, 4.25, 1.04);
    for (const side of [-1, 1]) box("architecture", pale, .02, 2.23, z + side * .51, .74, 4.38, .13);
    for (let floor = 0; floor < 4; floor++) {
      const slab = .12 + floor * 1.06;
      box("architecture", pale, .035, slab, z, .78, .09, 1.05);
      box("glass", glass, -.183, slab + .47, z, .025, .77, .57);
      if (floor > 0) {
        box("wood", rail, .405, slab + .32, z, .035, .035, .84);
        for (let n = 0; n < 8; n++) box("wood", rail, .4 + .035 * Math.sin(n / 7 * Math.PI), slab + .2, z - .39 + n * .11, .022, .28, .02);
      }
    }
  }
  box("architecture", taupe, -.04, 2.27, -1.36, .63, 4.47, 1.28);
  for (let floor = 0; floor < 4; floor++) {
    box("architecture", "#ded4bf", .29, .62 + floor * 1.025, -1.36, .035, .68, .63);
    box("glass", glass, .315, .62 + floor * 1.025, -1.36, .025, .55, .49);
  }
  roof(.0, 4.5, -1.36, .8, 1.38, .29, tile, 2);

  // Recessed membrane roof and parapets, with tile only around selected edges.
  box("roof", membrane, -1.82, 4.425, -1.3, 3.88, .1, 4.02);
  for (const x of [-3.8, .16]) {
    box("architecture", "#d2c7b1", x, 4.59, -1.3, .12, .34, 4.16);
    box("roof", tile, x, 4.77, -1.3, .16, .055, 4.2);
  }
  for (const z of [-3.36, .76]) {
    box("architecture", "#d2c7b1", -1.82, 4.59, z, 4.02, .34, .12);
    box("roof", tile, -1.82, 4.77, z, 4.06, .055, .16);
  }
  roof(-3.63, 4.54, -1.3, .58, 4.17, .21, tile);
  roof(.13, 4.51, -1.3, .55, 4.15, .17, tile);
  // Slight membrane stains and seams remain subordinate to the real roof equipment.
  for (let n = 0; n < 7; n++) box("roof", n % 2 ? "#aba99c" : "#c9c4b4", -2.96 + n * .4, 4.486, -1.4, .016, .009, 3.45);
  for (const [x, z, w, d] of [[-2.6, -2.32, .75, .43], [-1.03, -1.85, .86, .51], [-2.07, -.04, .86, .43]]) {
    box("roof", "#989c93", x, 4.53, z, w + .11, .085, d + .1);
    for (let unit = 0; unit < 3; unit++) {
      const px = x + (unit - 1) * w / 3;
      box("architecture", "#b9bcb1", px, 4.67, z, w / 3 - .035, .25, d);
      add("wood", new CylinderGeometry(.087, .087, .015, 12), "#606d67", px, 4.807, z);
      for (let grille = -1; grille <= 1; grille++) box("wood", "#87948a", px + grille * .045, 4.82, z, .012, .012, .16);
    }
  }
  box("architecture", "#b1b7ad", -1.17, 4.72, -.15, .54, .45, .5);
  box("roof", "#d0cbb9", -1.17, 4.96, -.15, .6, .045, .55);
  for (const x of [-2.9, -1.4]) box("wood", "#93978a", x, 4.51, -1.45, .045, .035, 3.37);

  // An arch is open geometry in the Y/Z plane; its hole casts a real shadow.
  const arch = (x: number, z: number, opening: number, spring: number, thickness: number, depth: number, base = .1) => {
    const inner = opening / 2, outer = inner + thickness;
    for (const side of [-1, 1]) box("architecture", cream, x, (spring + base) / 2, z + side * (inner + thickness / 2), depth, spring - base, thickness);
    const vertices: number[] = [];
    const quad = (a: number[], b: number[], c: number[], d: number[]) => vertices.push(...a, ...c, ...b, ...a, ...d, ...c);
    const point = (angle: number, radius: number, side: number) => [side * depth / 2, spring + Math.sin(angle) * radius, Math.cos(angle) * radius];
    for (let n = 0; n < 16; n++) {
      const a = n / 16 * Math.PI, b = (n + 1) / 16 * Math.PI;
      quad(point(a, inner, -1), point(b, inner, -1), point(b, outer, -1), point(a, outer, -1));
      quad(point(a, outer, 1), point(b, outer, 1), point(b, inner, 1), point(a, inner, 1));
      quad(point(a, inner, 1), point(b, inner, 1), point(b, inner, -1), point(a, inner, -1));
      quad(point(a, outer, -1), point(b, outer, -1), point(b, outer, 1), point(a, outer, 1));
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    add("architecture", geometry, cream, x, 0, z);
  };

  // Lower drive-through arrival terrace at the north corner, with an open arch.
  arch(-4.73, -2.69, .99, 1.03, .14, .14);
  arch(-3.99, -2.69, .99, 1.03, .14, .14);
  box("architecture", taupe, -4.36, 1.78, -2.69, 1.05, .28, 1.3);
  box("ground", "#d7c4a9", -4.36, 1.94, -2.69, 1.08, .065, 1.33);
  for (const x of [-4.83, -3.89]) {
    box("architecture", pale, x, 2.23, -2.69, .06, .06, 1.32);
    for (let n = 0; n < 10; n++) box("architecture", cream, x, 2.09, -3.28 + n * .13, .045, .24, .045);
  }
  for (const z of [-3.34, -2.04]) {
    box("architecture", pale, -4.36, 2.23, z, .98, .06, .06);
    for (let n = 0; n < 7; n++) box("architecture", cream, -4.8 + n * .145, 2.09, z, .045, .24, .045);
  }
  add("architecture", new CylinderGeometry(.15, .15, .04, 16), pale, -4.37, 2.15, -2.69);
  pole(new Vector3(-4.37, 1.98, -2.69), new Vector3(-4.37, 2.14, -2.69), .025, rail);

  // The opposite front corner is tall; a short three-bay arcade anchors its base.
  box("architecture", cream, -3.65, 2.38, .28, .74, 4.6, .86);
  roof(-3.65, 4.68, .28, 1.05, 1.04, .29, tile, 2);
  for (const z of [-.23, .26, .75]) arch(-4.3, z, .35, .72, .065, .14);
  box("architecture", taupe, -4.1, 1.025, .26, .57, .14, 1.53);
  box("architecture", pale, -4.1, 1.115, .26, .64, .045, 1.59);
  for (const y of [1.86, 2.95, 4.01]) windowOnX(-4.037, y, .28, .22, .43);

  // Side pedestrian pergola in front of the shallow window balconies.
  for (const x of [-2.95, -1.3]) for (const z of [1.11, 1.56]) {
    pole(new Vector3(x, .1, z), new Vector3(x, 1.12, z), .052, pale, "architecture");
    box("architecture", pale, x, 1.08, z, .17, .07, .17);
  }
  for (const z of [1.11, 1.56]) box("wood", "#927353", -2.12, 1.17, z, 1.91, .09, .065);
  for (let n = 0; n < 10; n++) box("wood", "#a17c58", -2.98 + n * .19, 1.23, 1.34, .055, .065, .7);
  box("ground", "#d4bfa2", -2.12, .08, 1.4, 2.0, .065, .83);

  // Curving pool with pale coping; ShapeGeometry keeps it a single batched piece.
  box("ground", "#dbceb6", 1.72, .06, .03, 2.82, .08, 5.62);
  const poolShape = new Shape();
  poolShape.moveTo(-.53, -1.35);
  poolShape.bezierCurveTo(-1.05, -.77, -.68, -.45, -.78, .12);
  poolShape.bezierCurveTo(-.94, .87, -.6, 1.49, .04, 1.49);
  poolShape.bezierCurveTo(.91, 1.49, .94, .75, .6, .22);
  poolShape.bezierCurveTo(.29, -.18, .77, -.91, .45, -1.3);
  poolShape.bezierCurveTo(.13, -1.67, -.25, -1.62, -.53, -1.35);
  const shapePlane = (scale: number) => new ShapeGeometry(poolShape, 28).scale(scale, scale, 1).rotateX(-Math.PI / 2);
  add("architecture", shapePlane(1), pale, 1.68, .109, -.04);
  add("water", shapePlane(.91), "#73c0c5", 1.68, .12, -.04);
  add("architecture", new CylinderGeometry(.32, .32, .075, 28), pale, 2.55, .12, 2.06);
  add("water", new CylinderGeometry(.258, .258, .02, 28), "#76b8bd", 2.55, .17, 2.06);
  for (const z of [-1.65, -.94, -.23, .48, 1.19]) {
    box("architecture", "#eee7d7", 2.93, .17, z, .27, .08, .43);
    box("architecture", "#dfd9c9", 2.93, .23, z - .18, .27, .19, .055);
  }
  for (const x of [.52, 1.36]) for (const z of [1.97, 2.64]) pole(new Vector3(x, .1, z), new Vector3(x, .91, z), .035, cream, "architecture");
  roof(.94, .94, 2.3, 1.03, .9, .24, "#a87961");

  // A long pool shade at the far end, and low enclosure with a usable gate gap.
  for (const x of [.8, 2.65]) for (const z of [-2.72, -2.22]) pole(new Vector3(x, .1, z), new Vector3(x, .78, z), .035, "#958169");
  for (let n = 0; n < 12; n++) box("wood", "#99836a", .76 + n * .176, .81, -2.48, .055, .045, .67);
  for (const z of [-2.94, 2.94]) {
    box("architecture", cream, 1.7, .36, z, 3.08, .56, .085);
    box("architecture", "#9c9a8b", 1.7, .17, z, 3.08, .18, .09);
    box("architecture", pale, 1.7, .66, z, 3.11, .065, .13);
  }
  for (const [z, length] of [[-1.78, 2.18], [1.87, 1.95]]) {
    box("architecture", cream, 3.25, .34, z, .08, .53, length);
    box("architecture", pale, 3.25, .63, z, .14, .065, length + .02);
  }
  for (const z of [-.66, .87]) box("architecture", pale, 3.25, .46, z, .17, .79, .17);
  // Recess the open gate leaf alongside its wall; keep the central route visible.
  for (let n = 0; n < 7; n++) box("wood", rail, 3.08, .48, -.58 + n * .09, .02, .61, .015);
  box("wood", rail, 3.08, .8, -.3, .025, .025, .65);
  box("ground", "#d3c2a9", 2.96, .095, .33, .7, .04, .59);

  // Some larger palms belong near the parcel corners; low beds keep routes clear.
  palm(2.2, -3.15, 8041, true);
  palm(2.08, 3.16, 8042, true);
  palm(-3.0, 2.5, 8043, true);
  palm(-.62, 2.75, 8044, true);
  for (let n = 0; n < 6; n++) bush(-3.38 + n * .48, 2.06, 8080 + n, .19 + (n % 2) * .03);
  for (const [x, z] of [[2.8, -3.05], [.49, -3.53], [-4.53, 1.76], [2.76, 3.04]]) {
    box("ground", "#8d9978", x, .08, z, .58, .065, .44);
    bush(x, z, 8061, .23);
  }

  // Preserve the existing southern parking parcel and clear drive aisle.
  box("ground", "#838a81", -1.7, .045, 5, 5.4, .05, 4);
  parkingRow(-1.7, 5.95, 6, 190);
  for (const x of [-4.25, .8]) {
    box("ground", "#b4b59b", x, .11, 6, .45, .16, 1.9);
    bush(x, 6, 50, .35);
  }
}
