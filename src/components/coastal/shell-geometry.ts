import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  RGBAFormat,
  SRGBColorSpace,
} from "three";

export type ShellKind = "scallop" | "clam" | "spiral";

function noise(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Growth lines and mineral flecks, shared by all shells rather than downloaded. */
export function makeShellTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const growth = Math.sin(v * 230 + Math.sin(u * 19) * 1.4);
      const fleck = noise(x, y);
      const pigment = Math.sin(u * 67 + Math.sin(v * 18) * 2);
      const shade = 237 + growth * 5 + fleck * 8 + pigment * 4;
      const offset = (y * size + x) * 4;
      data[offset] = shade;
      data[offset + 1] = shade - 4;
      data[offset + 2] = shade - 9;
      data[offset + 3] = 255;
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Closed, thick valves: softly domed surfaces, rounded ribs, and an uneven lip. */
function makeValve(kind: "scallop" | "clam") {
  const segments = 128;
  const rings = 44;
  const positions: number[] = [];
  const colors: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const cream = new Color(kind === "clam" ? "#e6d9c5" : "#f5e5dd");
  const pigment = new Color(kind === "clam" ? "#9e8890" : "#c39687");
  const color = new Color();
  const layerSize = (rings + 1) * (segments + 1);
  for (let side = 0; side < 2; side++) {
    for (let ring = 0; ring <= rings; ring++) {
      const radius = ring / rings;
      for (let segment = 0; segment <= segments; segment++) {
        const u = segment / segments;
        const angle = u * Math.PI * 2;
        let rib = Math.cos(u * Math.PI * 58 + Math.sin(radius * 8) * 0.1);
        const wornEdge =
          Math.sin(angle * 31) * 0.004 + Math.sin(angle * 53) * 0.003;
        const rim = 1 + (rib * 0.008 + wornEdge) * Math.pow(radius, 7);
        let x: number;
        let y: number;
        let depth: number;
        if (kind === "clam") {
          x = Math.cos(angle) * radius * rim * 0.78;
          y = Math.sin(angle) * radius * rim * 0.62;
          depth = Math.pow(Math.max(0, 1 - radius * radius), 0.7) * 0.32;
          depth += rib * 0.006 * Math.sin(radius * Math.PI);
        } else {
          // A rounded valve with a flattened hinge and two small hinge ears.
          // Ribs radiate from that hinge, rather than forming straight fan folds.
          const edgeX = Math.cos(angle) * 0.88;
          const edgeY = Math.max(-0.62, Math.sin(angle) * 0.86);
          const hingeAngle = Math.atan2(edgeX * radius, edgeY * radius + 0.65);
          rib = Math.cos(hingeAngle * 26 + Math.sin(radius * 9) * 0.15);
          const scalloping = (rib * 0.014 + wornEdge) * Math.pow(radius, 8);
          const ears =
            Math.exp(-Math.pow((Math.sin(angle) + 0.82) * 15, 2)) * 0.065;
          x = edgeX * radius * (1 + scalloping + ears);
          y = edgeY * radius * (1 + scalloping);
          depth = Math.pow(Math.max(0, 1 - radius * radius), 0.8) * 0.4;
          depth *= 0.78 + (y + 0.62) * 0.15;
          depth += rib * 0.012 * Math.pow(Math.max(0, 1 - radius), 0.5);
        }
        const thickness = 0.018 + (1 - radius) * 0.025;
        positions.push(x, y, side === 0 ? depth : depth - thickness);
        if (kind === "scallop") {
          uv.push(
            Math.atan2(x, y + 0.65) / Math.PI + 0.5,
            Math.hypot(x, y + 0.65) / 1.6,
          );
        } else {
          uv.push(u, radius);
        }
        const blotch =
          Math.sin(angle * 11 + Math.sin(radius * 17)) *
          Math.sin(radius * 29 + angle * 5);
        const streak = Math.pow(
          0.5 + Math.sin(angle * 19 + radius * 3) * 0.5,
          5,
        );
        const amount =
          kind === "scallop"
            ? 0.04 + radius * 0.11 + streak * 0.15 + blotch * 0.035
            : 0.1 + radius * 0.14 + streak * 0.19 + blotch * 0.07;
        color.copy(cream).lerp(pigment, amount);
        if (side === 1) color.lerp(cream, 0.6);
        colors.push(color.r, color.g, color.b);
        if (ring < rings && segment < segments) {
          const a = side * layerSize + ring * (segments + 1) + segment;
          const b = a + segments + 1;
          if (side === 0) indices.push(a, a + 1, b, a + 1, b + 1, b);
          else indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
    }
  }
  // Join the upper and lower lips; the edge has thickness even when it rocks.
  for (let segment = 0; segment < segments; segment++) {
    const a = rings * (segments + 1) + segment;
    const b = a + layerSize;
    indices.push(a, b, a + 1, a + 1, b, b + 1);
  }
  return finishGeometry(positions, colors, uv, indices);
}

/** A tapering logarithmic whorl with a thick, open aperture and darker interior. */
function makeSpiral() {
  const turns = 180;
  const sides = 36;
  const positions: number[] = [];
  const colors: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const cream = new Color("#ead4b0");
  const ochre = new Color("#9c6547");
  const color = new Color();
  const layerSize = (turns + 1) * (sides + 1);
  for (let layer = 0; layer < 2; layer++) {
    for (let ring = 0; ring <= turns; ring++) {
      const t = ring / turns;
      const angle = t * Math.PI * 5.5;
      const radius = Math.exp((t - 1) * 3.8) * 0.65;
      const tube = radius * (layer === 0 ? 0.57 : 0.47);
      for (let side = 0; side <= sides; side++) {
        const u = side / sides;
        const phi = u * Math.PI * 2;
        const lip = 1 + Math.pow(t, 30) * 0.08;
        const growth = 1 + Math.sin(t * 540) * 0.004;
        const crossSection = Math.cos(phi) * tube * lip * growth;
        positions.push(
          Math.cos(angle) * (radius + crossSection),
          Math.sin(angle) * (radius + crossSection),
          0.05 + radius * 0.21 + Math.sin(phi) * tube * 0.76,
        );
        uv.push(u, t);
        const bands = Math.pow(
          0.5 + Math.sin(t * 91 + Math.sin(phi * 3) * 1.4) * 0.5,
          7,
        );
        color.copy(cream).lerp(ochre, layer ? 0.72 : 0.12 + bands * 0.55);
        colors.push(color.r, color.g, color.b);
        if (ring < turns && side < sides) {
          const a = layer * layerSize + ring * (sides + 1) + side;
          const b = a + sides + 1;
          if (layer === 0) indices.push(a, b, a + 1, a + 1, b, b + 1);
          else indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
  }
  for (let side = 0; side < sides; side++) {
    const a = turns * (sides + 1) + side;
    const b = a + layerSize;
    indices.push(a, a + 1, b, a + 1, b + 1, b);
  }
  return finishGeometry(positions, colors, uv, indices);
}

function finishGeometry(
  positions: number[],
  colors: number[],
  uv: number[],
  indices: number[],
) {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colors), 3),
  );
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function makeShellGeometries() {
  return {
    scallop: makeValve("scallop"),
    clam: makeValve("clam"),
    spiral: makeSpiral(),
  };
}
