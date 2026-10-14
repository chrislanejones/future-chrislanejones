import { BufferAttribute, BufferGeometry, CylinderGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";

/** Bounded additions to the existing Best Western parcel, preserving its pool and lots. */
export function addBestWesternDetails({ box, roof, add, pole, bush }: CastilloKit) {
  const wall = "#dfd5bd", cream = "#f3ead3", warm = "#b58f74";
  const tile = "#c18261", stone = "#b9bbad";

  // A curved band with a real opening; turn it for the canopy's long side bays.
  const archBand = (x: number, spring: number, z: number, width: number, rise: number, band: number, depth: number, turn = 0) => {
    const radius = width / 2, vertices: number[] = [];
    const point = (angle: number, outside: boolean, side: number) => [
      Math.cos(angle) * (radius + (outside ? band : 0)),
      Math.sin(angle) * (rise + (outside ? band : 0)),
      side * depth / 2,
    ];
    const quad = (a: number[], b: number[], c: number[], d: number[]) => vertices.push(...a, ...b, ...c, ...a, ...c, ...d);
    for (let n = 0; n < 18; n++) {
      const a = n * Math.PI / 18, b = (n + 1) * Math.PI / 18;
      quad(point(a, false, 1), point(a, true, 1), point(b, true, 1), point(b, false, 1));
      quad(point(a, true, -1), point(a, false, -1), point(b, false, -1), point(b, true, -1));
      quad(point(a, true, -1), point(b, true, -1), point(b, true, 1), point(a, true, 1));
      quad(point(a, false, 1), point(b, false, 1), point(b, false, -1), point(a, false, -1));
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    add("architecture", geometry, cream, x, spring, z, turn);
  };

  // The arrival canopy attaches to the NORTH side of the short entrance wing.
  // Its drive runs east/west from A1A into the hotel's northern parking aisle.
  const cx = -11.7, cz = -2.1;
  box("ground", "#858c85", -11.95, .053, cz, 7.15, .04, 1.25);
  box("ground", "#a69783", cx, .079, cz, 3.28, .035, 1.54);
  for (let n = 0; n < 12; n++) box("ground", "#8c8374", -13.17 + n * .26, .102, cz, .013, .008, 1.19);
  for (const x of [-13.13, -11.7, -10.27]) for (const z of [-2.76, -1.44]) {
    box("architecture", stone, x, .2, z, .27, .3, .25);
    box("architecture", wall, x, .84, z, .18, 1.15, .16);
    box("architecture", cream, x, 1.37, z, .25, .11, .23);
    box("architecture", warm, x, .42, z, .2, .06, .18);
    for (let course = 0; course < 3; course++) {
      box("architecture", course % 2 ? "#c6c7b7" : "#a7afa4", x + .139, .095 + course * .085, z, .014, .018, .23);
      box("architecture", course % 2 ? "#b0b6a8" : "#c7c8b9", x, .12 + course * .077, z + .13, .25, .018, .012);
    }
  }
  for (const x of [-13.13, -10.27]) archBand(x, 1.18, cz, 1.15, .3, .11, .19, Math.PI / 2);
  for (const z of [-2.76, -1.44]) for (const x of [-12.415, -10.985]) archBand(x, 1.19, z, 1.25, .29, .11, .17);
  box("architecture", cream, cx, 1.62, cz, 3.28, .1, 1.58);
  box("architecture", wall, cx, 1.76, cz, 3.28, .18, 1.59);
  roof(cx, 1.86, cz, 3.3, 1.6, .28, tile);
  // Link the north canopy's sheltered pedestrian edge to the entrance wing.
  box("architecture", cream, cx, 1.7, -1.26, 1.3, .1, .42);
  roof(cx, 1.77, -1.26, 1.34, .45, .13, tile);

  // The decorative gables face the two open ends of the drive, east and west.
  for (const x of [-13.21, -10.19]) {
    box("architecture", warm, x, 2.01, cz, .15, .41, .83);
    roof(x, 2.22, cz, .21, .94, .22, tile, 2);
    const outward = x > cx ? .086 : -.086;
    archBand(x + outward, 1.91, cz, .29, .19, .065, .035, Math.PI / 2);
    for (const side of [-1, 1]) box("architecture", cream, x, 1.84, cz + side * .177, .19, .15, .065);
  }
  for (let n = 0; n < 9; n++) {
    const x = -12.93 + n * .3;
    const crest = 1.875 + .28 * Math.min(1, (1.65 - Math.abs(x - cx)) / .8);
    pole(new Vector3(x, 1.875, -2.89), new Vector3(x, crest, cz), .013, "#b97454", "roof");
    pole(new Vector3(x, crest, cz), new Vector3(x, 1.875, -1.31), .013, "#c98d6b", "roof");
  }

  // Blue planters and lanterns sit along the building-side edge of the canopy.
  for (const x of [-12.82, -10.61]) {
    add("architecture", new CylinderGeometry(.12, .085, .22, 14), "#466c8f", x, .2, -1.32);
    add("ground", new CylinderGeometry(.104, .104, .015, 14), "#726955", x, .318, -1.32);
    for (let leaf = 0; leaf < 5; leaf++) {
      const a = leaf * Math.PI * 2 / 5;
      pole(new Vector3(x, .32, -1.32), new Vector3(x + Math.cos(a) * .12, .48, -1.32 + Math.sin(a) * .12), .018, "#658264", "foliage");
    }
  }
  for (const x of [-13.13, -10.27]) {
    box("wood", "#53605a", x, .99, -1.56, .1, .19, .1);
    box("architecture", "#e2d5ae", x, .99, -1.62, .065, .12, .035);
  }

  // The boulevard-side area where the canopy previously sat is open lawn.
  box("ground", "#99a781", -9.67, .063, 2.55, 2.0, .025, 3.85);

  // Add arch bands to the existing front arcade posts, without closing the gaps.
  for (let bay = 1; bay < 8; bay++) {
    const x = -18 + (bay + .5) * .7;
    archBand(x, .91, 5.02, .6, .195, .08, .16);
    archBand(x, 1.73, 5.02, .6, .16, .08, .13);
  }
  for (let post = 1; post <= 8; post++) {
    const x = -18 + post * .7;
    box("architecture", wall, x, 1.62, 5.02, .09, .65, .15);
    box("architecture", warm, x, 1.76, 5.02, .14, .045, .18);
    box("architecture", cream, x, .9, 5.02, .14, .06, .19);
    box("architecture", stone, x, .19, 5.02, .15, .23, .21);
  }
  // A few low garden accents stay between existing posts rather than in stalls.
  bush(-17.55, 5.65, 9312, .17);
  bush(-12.22, 5.61, 9313, .17);
}
