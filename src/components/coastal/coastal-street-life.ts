import { BufferAttribute, BufferGeometry, CylinderGeometry, IcosahedronGeometry, Vector3 } from "three";
import type { CastilloKit } from "./castillo-real";
import { duneHeight } from "./coast-terrain";

const ROWS = [-32, -25.5, -16.2, -10];

/** Two short rows, with usable porches facing +X/the ocean. */
export function buildCoastFacingHomes({ box, roof, add, pole, bush, palm }: CastilloKit) {
  const rail = (a: Vector3, b: Vector3, color: string, height = .33) => {
    pole(a.clone().add(new Vector3(0, height, 0)), b.clone().add(new Vector3(0, height, 0)), .018, color);
    const count = Math.ceil(a.distanceTo(b) / .13);
    for (let n = 0; n <= count; n++) {
      const p = a.clone().lerp(b, n / count);
      pole(p, p.clone().add(new Vector3(0, height, 0)), .013, color);
    }
  };
  const oceanWindow = (x: number, y: number, z: number, w: number, h: number, trim: string, sliding = false) => {
    box("architecture", trim, x, y, z, .05, h + .1, w + .1);
    box("glass", "#496d78", x + .034, y, z, .022, h, w);
    box("architecture", trim, x + .05, y, z, .027, h, .025);
    if (!sliding) box("architecture", trim, x + .05, y, z, .027, .025, w);
    box("wood", "#8d998c", x + .043, y - h / 2 - .055, z, .09, .045, w + .15);
  };
  ROWS.forEach((z, row) => {
    for (let depth = 0; depth < 2; depth++) {
      // The newest 10th Street study supplies these individual landmark parcels.
      if (row === 3 || (row === 2 && depth === 0)) continue;
      const x = depth === 0 ? 3.9 : 1.55;
      const w = depth === 0 ? 1.65 : 1.68;
      const d = [2.8, 2.65, 2.9, 2.74][row];
      const raised = depth === 0 && (row === 0 || row === 3);
      const steep = depth === 0 && row === 1;
      const modern = depth === 0 && row === 2;
      const base = raised ? .88 : .08;
      const h = steep ? 1.23 : raised ? 1.4 : depth === 0 ? 2.08 : row % 2 ? 1.35 : 1.82;
      const top = base + h;
      const facade = depth === 0 ? ["#aac7c7", "#b9ad91", "#e7e3d7", "#abbec9"][row] : ["#dddcc6", "#dbc0aa", "#c4d0c4", "#d5d2b8"][row];
      const trim = modern ? "#bfc4bd" : "#f0eadc";
      const timber = steep ? "#a28c6d" : "#c2b9a4";
      const front = x + w / 2;
      const deckDepth = depth === 0 ? .67 : .3;
      const edge = front + deckDepth;
      const deckY = raised ? 1.02 : .2;
      const handrail = modern ? "#566663" : "#d5d2bf";

      box("ground", row % 2 ? "#b7b49c" : "#a7ac8b", x, .024, z, 2.08, .035, d + 1.6);
      const driveStart = z + d / 2 + .15, driveEnd = z + 3.8;
      box("ground", row === 1 ? "#c5bba4" : "#c4c3b5", x - .3, .047, (driveStart + driveEnd) / 2, .79, .035, driveEnd - driveStart);
      if (raised) {
        // Real air below the living floor, with individual piers and a sheltered bay.
        for (const px of [x - w * .44, x + w * .44]) for (const pz of [z - d * .44, z + d * .44]) {
          box("architecture", "#d7d2c0", px, .45, pz, .14, .9, .16);
          box("architecture", "#bbb9a9", px, .09, pz, .22, .12, .23);
        }
        box("architecture", "#b3b9b0", x - .6, .46, z, .14, .82, d * .75);
        box("ground", "#c9c6b8", x, .059, z, w, .055, d);
      } else box("architecture", "#aaa99a", x, .1, z, w + .02, .13, d + .03);
      box("architecture", facade, x, base + h / 2, z, w, h, d);
      for (const end of [-1, 1]) {
        box("architecture", trim, front + .023, base + h / 2, z + end * (d / 2 - .04), .055, h, .08);
        box("architecture", trim, x, top - .055, z + end * (d / 2 + .028), w + .04, .095, .055);
        if (end === 1 && depth === 1 && row % 2 === 1) {
          // A few inland-row homes open onto the drive through a paneled garage.
          box("architecture", trim, x - .09, .47, z + d / 2 + .026, .97, .84, .045);
          box("architecture", row === 1 ? "#9baea8" : "#aeb6ab", x - .09, .46, z + d / 2 + .056, .83, .73, .035);
          for (let panel = 0; panel < 5; panel++) box("wood", "#d5d9ca", x - .09, .18 + panel * .14, z + d / 2 + .079, .81, .014, .014);
        } else {
          box("architecture", trim, x - .07, base + .66, z + end * (d / 2 + .026), .47, .61, .04);
          box("glass", "#5d7a80", x - .07, base + .66, z + end * (d / 2 + .05), .37, .5, .025);
        }
      }
      if (!modern) for (let board = 0; board < Math.floor(h / .11); board++) {
        box("wood", depth === 0 ? "#97aaa0" : "#b8beac", front + .027, base + .06 + board * .11, z, .011, .01, d - .13);
      }
      if (modern) {
        box("roof", "#afb1a7", x, top + .04, z, w + .11, .1, d + .14);
        for (const side of [-1, 1]) box("architecture", trim, x + side * w / 2, top + .13, z, .065, .24, d);
        box("architecture", "#bac0b6", x - .2, top + .26, z - .73, .4, .24, .5);
        add("wood", new CylinderGeometry(.095, .095, .015, 12), "#68736c", x - .2, top + .389, z - .73);
      } else {
        const roofColor = steep ? "#94795e" : row === 3 ? "#bfc9c7" : "#a7b8b6";
        roof(x, top + .04, z, w + .18, d + .2, steep ? 1.17 : .42, roofColor, steep ? 2 : row % 3);
        if (raised && row === 3) roof(x + .13, top + .06, z + .81, 1.52, .9, .39, "#b7c2c0", 2);
        if (steep) {
          const g = new BufferGeometry();
          g.setAttribute("position", new BufferAttribute(new Float32Array([
            front + .096, top + .12, z - .54,
            front + .096, top + .98, z,
            front + .096, top + .12, z + .54,
          ]), 3));
          g.computeVertexNormals();
          add("glass", g, "#4b6772", 0, 0, 0);
          for (const end of [-1, 1]) pole(new Vector3(front + .11, top + .1, z + end * .56), new Vector3(front + .11, top + 1.02, z), .018, trim, "architecture");
        }
      }

      const windowY = raised ? base + .68 : modern ? 1.52 : .69;
      for (const offset of [-.74, .74]) oceanWindow(front + .03, windowY, z + offset, modern ? .68 : .47, modern ? .82 : .62, trim);
      oceanWindow(front + .03, deckY + .41, z, .55, .78, trim, true);
      if (h > 1.7 && !modern) for (const offset of [-.68, .68]) oceanWindow(front + .03, 1.52, z + offset, .42, .53, trim);

      // Ocean-facing decks stand on posts; the side stair reaches their actual floor.
      box("wood", timber, front + deckDepth / 2, deckY, z, deckDepth + .08, .08, d * .91);
      for (let plank = 0; plank < 12; plank++) box("wood", "#a49c87", front + deckDepth / 2, deckY + .045, z - d * .42 + plank * d * .84 / 11, deckDepth, .009, .012);
      if (raised) for (const pz of [z - d * .41, z + d * .41]) {
        pole(new Vector3(edge - .06, .06, pz), new Vector3(edge - .06, deckY, pz), .038, "#a79f87");
      }
      rail(new Vector3(edge, deckY + .05, z - d * .43), new Vector3(edge, deckY + .05, z + d * .43), handrail);
      rail(new Vector3(front, deckY + .05, z - d * .43), new Vector3(edge, deckY + .05, z - d * .43), handrail);
      if (!raised) {
        // Covered bungalow porches and light pergolas create readable shade.
        const shadeY = modern ? 1.12 : Math.min(top - .12, 1.09);
        for (const pz of [z - d * .42, z + d * .42]) pole(new Vector3(edge - .05, deckY, pz), new Vector3(edge - .05, shadeY, pz), .026, trim, "architecture");
        if (modern) for (let slat = 0; slat < 11; slat++) box("wood", "#9d927c", front + deckDepth / 2, shadeY, z - 1.15 + slat * .23, deckDepth + .12, .045, .04);
        else box("roof", "#a3b2a7", front + deckDepth / 2, shadeY, z, deckDepth + .15, .07, d * .97);
      }
      const steps = raised ? 9 : 2;
      const run = raised ? 1.07 : .28;
      const stairZ = z + d / 2 + .28;
      for (let step = 0; step < steps; step++) {
        const y = (step + 1) * deckY / steps;
        box("wood", timber, edge - run + step * run / steps, y / 2, stairZ, run / steps + .025, y, .37);
      }
      // Join the stair landing continuously to the porch instead of leaving a gap.
      const landingStart = z + d * .455, landingEnd = stairZ + .215;
      box("wood", timber, edge - .05, deckY, (landingStart + landingEnd) / 2, .36, .08, landingEnd - landingStart + .025);
      const walkStart = x - .3, walkEnd = edge - run + .12;
      box("ground", "#c8c1ad", (walkStart + walkEnd) / 2, .052, stairZ, walkEnd - walkStart, .025, .34);
      if (raised) {
        for (const side of [-1, 1]) pole(new Vector3(edge - run, .34, stairZ + side * .2), new Vector3(edge, deckY + .34, stairZ + side * .2), .018, handrail);
        rail(new Vector3(edge, deckY + .05, z + d * .43), new Vector3(edge, deckY + .05, stairZ + .23), handrail);
      }
      if (depth === 0) {
        // Two modest chairs and a side planter leave the door and stair usable.
        for (const pz of [z - .8, z + .8]) {
          box("wood", "#d8d0ba", front + .35, deckY + .15, pz, .25, .045, .26);
          box("wood", "#ddd5c2", front + .19, deckY + .26, pz, .045, .29, .26);
          for (const px of [front + .22, front + .44]) box("wood", "#b9b5a2", px, deckY + .075, pz, .028, .15, .028);
        }
        bush(x - .48, z - d / 2 - .31, 7600 + row, .18);
        if (row === 0 || row === 3) palm(x + .18, z - d / 2 - .42, 7620 + row, true);
      } else bush(x - .5, z + d / 2 + .44, 7650 + row, .17);

      // Gutters and a downpipe follow the ocean-side eave and corner board.
      if (!steep) {
        box("architecture", "#d1d2c4", front + .085, top + .005, z, .075, .065, d + .08);
        const pipeZ = z - d / 2 + .1;
        pole(new Vector3(front + .087, .08, pipeZ), new Vector3(front + .087, top, pipeZ), .014, "#d0d0c2", "architecture");
      }
      // Small condenser slabs sit beside the rear wall, with fan and grille detail.
      if (depth === 1 && row % 2 === 0) {
        const acX = x - w / 2 - .18, acZ = z - .73;
        box("ground", "#bbbbae", acX, .057, acZ, .37, .055, .47);
        box("architecture", "#afb6ab", acX, .22, acZ, .29, .28, .36);
        add("wood", new CylinderGeometry(.105, .105, .018, 14), "#64736b", acX, .369, acZ);
        for (let line = 0; line < 5; line++) box("wood", "#7a8b80", acX - .09 + line * .045, .382, acZ, .012, .009, .17);
      }
      if (depth === 0 && (row === 0 || row === 2)) {
        // A sheltered rinse station on a draining pad, clear of decks and stairs.
        const sx = 5.13, sz = z - d / 2 - .53;
        box("ground", "#c6c1ad", sx, .055, sz, .56, .055, .55);
        box("wood", "#7c877c", sx, .085, sz, .12, .01, .12);
        pole(new Vector3(sx - .2, .08, sz), new Vector3(sx - .2, .79, sz), .027, timber);
        pole(new Vector3(sx - .19, .75, sz), new Vector3(sx - .03, .75, sz), .012, "#aab4af");
        add("wood", new CylinderGeometry(.034, .047, .025, 10), "#aeb9b1", sx - .02, .736, sz);
        for (let slat = 0; slat < 6; slat++) box("wood", "#a79e87", sx + .16, .33, sz - .22 + slat * .085, .025, .5, .054);
      }
      if (depth === 1) {
        // Irregular low planting beds soften the edge of the paved apron.
        const bed = new CylinderGeometry(.26, .29, .023, 9); bed.scale(.68, 1, 1.45);
        add("ground", bed, "#97896b", x + .55, .05, z + d / 2 + .57);
        for (let tuft = 0; tuft < 4; tuft++) {
          const pz = z + d / 2 + .32 + tuft * .16;
          for (let leaf = 0; leaf < 5; leaf++) {
            const angle = leaf * Math.PI * 2 / 5 + row;
            pole(new Vector3(x + .55, .06, pz), new Vector3(x + .55 + Math.cos(angle) * .09, .17 + (leaf % 2) * .055, pz + Math.sin(angle) * .1), .011, "#7f9169", "foliage");
          }
        }
      }
    }
  });
}

/** Sparse generic visitors for scale; all remain part of the static merged town. */
export function addCoastalVisitors({ add, box, pole }: CastilloKit) {
  const placements = [
    [-8.18, 2.2, 0, 0], [-8.2, 2.72, 1, 0],
    [-10.55, -3.58, 2, 1], [-4.65, -4.32, 3, 0],
    [5.92, 3.4, 4, 0], [7.65, 3.53, 5, 0], [8.15, 3.51, 6, 1],
    [12.15, -4.98, 7, 0], [14.4, 7.7, 8, 0], [14.25, 8.24, 9, 0],
    [5.57, -28.1, 10, 1], [3.05, -13.25, 11, 0],
  ];
  const shirts = ["#d2cec0", "#a16f5d", "#719292", "#677f94", "#d9c49d", "#80966c"];
  const skins = ["#c89573", "#b27e59", "#845b44", "#dab294"];
  for (const [x, z, seed, standing] of placements) {
    const root = x >= 6 ? duneHeight(x, z) + .004 : x < -7.8 ? .037 : .068;
    const small = seed === 6, scale = small ? .72 : 1;
    const heading = seed % 2 ? .55 : -1.2;
    const p = (px: number, py: number, pz: number) => new Vector3(px * scale, py * scale, pz * scale).applyAxisAngle(new Vector3(0, 1, 0), heading).add(new Vector3(x, root, z));
    const put = (color: string, px: number, py: number, pz: number, w: number, h: number, d: number) => {
      const v = p(px, py, pz); box("architecture", color, v.x, v.y, v.z, w * scale, h * scale, d * scale, heading);
    };
    const skin = skins[seed % skins.length], shirt = shirts[seed % shirts.length];
    const head = new IcosahedronGeometry(.062 * scale, 1); head.scale(.9, 1.09, .9);
    const center = p(0, .48, 0); add("architecture", head, skin, center.x, center.y, center.z);
    put(shirt, 0, .342, 0, .15, .18, .1);
    put("#65717a", 0, .245, 0, .125, .065, .09);
    for (const side of [-1, 1]) {
      const stride = standing ? 0 : side * .068;
      pole(p(side * .038, .23, 0), p(side * .045, .12, stride), .026 * scale, "#65717a", "architecture");
      pole(p(side * .045, .12, stride), p(side * .046, .035, stride * 1.5), .021 * scale, skin, "architecture");
      put("#4f5551", side * .046, .019, stride * 1.5 + .015, .05, .035, .08);
      pole(p(side * .085, .41, 0), p(side * .103, .315, -stride), .023 * scale, shirt, "architecture");
      pole(p(side * .103, .315, -stride), p(side * .1, .25, -stride * 1.3), .018 * scale, skin, "architecture");
    }
    if (seed === 4 || seed === 8) {
      const brim = p(0, .54, 0);
      add("architecture", new CylinderGeometry(.083 * scale, .083 * scale, .016, 12), "#d0bc92", brim.x, brim.y, brim.z);
      put("#c9b185", 0, .558, 0, .1, .055, .1);
    }
  }
}
