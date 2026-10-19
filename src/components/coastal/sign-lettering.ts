import { ExtrudeGeometry, ShapePath } from "three";
import outlines from "./sign-art/outlines.json";

export type CoastSignText = keyof typeof outlines;

/** Fixed vector artwork, extruded into the town's existing geometry batches. */
export function signLettering(text: CoastSignText, width: number, depth = .004) {
  const path = new ShapePath();
  for (const command of outlines[text]) {
    const [kind, ...values] = command;
    const v = values as number[];
    if (kind === "m") path.moveTo(v[0], v[1]);
    else if (kind === "l") path.lineTo(v[0], v[1]);
    else if (kind === "q") path.quadraticCurveTo(v[0], v[1], v[2], v[3]);
    else if (kind === "c") path.bezierCurveTo(v[0], v[1], v[2], v[3], v[4], v[5]);
    else path.currentPath?.closePath();
  }
  const geometry = new ExtrudeGeometry(path.toShapes(), {
    depth: depth / width, bevelEnabled: false, curveSegments: 8,
  });
  geometry.scale(width, width, width);
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox!;
  geometry.translate(-(bounds.min.x + bounds.max.x) / 2, -(bounds.min.y + bounds.max.y) / 2, 0);
  return geometry;
}
