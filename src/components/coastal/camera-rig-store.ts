import type { Camera } from "three";

// Shared state between the camera rig (inside the R3F canvas) and the HTML
// controls around it: held arrows, requested flights, and a live readout.
// Scene frame: +X is the ocean (east), -Z is "north" for the compass readout.

export type RigMove =
  | "forward" | "back" | "left" | "right" | "up" | "down"
  | "orbitLeft" | "orbitRight" | "tiltUp" | "tiltDown" | "zoomIn" | "zoomOut";

export type CameraView = { position: [number, number, number]; target: [number, number, number] };
export type RigReadout = CameraView & { heading: number; pitch: number; distance: number; fov: number };

/** The shot camera: placed in the world and driven with the same pads as the global camera. */
export type Drive = "explorer" | "shot";
/** Which camera fills the screen. "shot" = looking through the shot camera, with the global view in the corner. */
export type MainView = "global" | "shot";
export type RigMode = "global" | "shot" | "through";
export type ShotAspect = "window" | "16:9" | "hero" | "phone";
export const SHOT_ASPECTS: Record<ShotAspect, number | null> = { window: null, "16:9": 16 / 9, hero: 1400 / 680, phone: 9 / 16 };
export type ShotPose = { position: [number, number, number]; forward: [number, number, number]; heading: number; pitch: number; fov: number };
export type ShotState = { present: boolean; fov: number; aspect: ShotAspect; pose: ShotPose | null };
export type ShotCommand = "add" | "fromView" | null;

/** Velocity on the six pad axes, eased toward what's held. Shared by both cameras. */
export type Velocity = { forward: number; right: number; rise: number; orbit: number; tilt: number; zoom: number };
export const stillVelocity = (): Velocity => ({ forward: 0, right: 0, rise: 0, orbit: 0, tilt: 0, zoom: 0 });
export function wantedVelocity(held: Set<RigMove>): Velocity {
  const axis = (plus: RigMove, minus: RigMove) => (held.has(plus) ? 1 : 0) - (held.has(minus) ? 1 : 0);
  return {
    forward: axis("forward", "back"), right: axis("right", "left"), rise: axis("up", "down"),
    orbit: axis("orbitRight", "orbitLeft"), tilt: axis("tiltUp", "tiltDown"), zoom: axis("zoomIn", "zoomOut"),
  };
}
/** Ease in fast and out a little slower: holds feel weighted, stops don't skid. Returns true while anything moves. */
export function easeVelocity(v: Velocity, want: Velocity, dt: number) {
  let moving = false;
  for (const key of Object.keys(v) as (keyof Velocity)[]) {
    const goal = want[key];
    v[key] += (goal - v[key]) * (1 - Math.exp(-dt / (goal ? .11 : .16)));
    if (!goal && Math.abs(v[key]) < .003) v[key] = 0;
    if (v[key]) moving = true;
  }
  return moving;
}

/** Where the viewfinder sits, in CSS pixels from the bottom-right, for a canvas of this size. */
export function viewfinderRect(width: number, height: number, aspect: number | null) {
  const ratio = aspect ?? width / Math.max(1, height);
  let w = Math.min(420, Math.max(240, width * .3));
  let h = w / ratio;
  if (h > height * .45) { h = height * .45; w = h * ratio; }
  // 56 from the bottom leaves room for the viewfinder's buttons under the frame.
  return { x: Math.round(width - w - 16), y: 56, w: Math.round(w), h: Math.round(h) };
}

/** Approved views. The page cameras in hero-coast-scene.tsx use the same numbers. */
export const CAMERA_PRESETS: Record<string, CameraView> = {
  Overview: { position: [-12, 65, 87], target: [-23, 0, -30] },
  "Home hero": { position: [8, 30, 48], target: [-1, 0, -3] },
  "9th St walk": { position: [-7.1, .66, 3.6], target: [12, 3, 3.4] },
  Pier: { position: [44, 16, -62], target: [16, 1, -94] },
  Beach: { position: [34, 9, 12], target: [18, 0, -8] },
  "Top down": { position: [-10, 170, -29.9], target: [-10, 0, -30] },
};

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach(listener => listener());

let fly: CameraView | null = null;
let jump: CameraView | null = null;
let shotCommand: ShotCommand = null;
let shotAim: { heading: number; pitch: number } | null = null;
let readout: RigReadout = { ...CAMERA_PRESETS.Overview, heading: 0, pitch: 0, distance: 0, fov: 48 };

export const cameraRig = {
  /** Arrows and keys currently held. The driven camera eases toward them every frame. */
  held: new Set<RigMove>(),
  fast: false,
  speed: 1,
  /** Which camera the pads and keys move. */
  drive: "explorer" as Drive,
  /** Mouse orbit on the global camera; off while something else owns the pointer. */
  orbitEnabled: true,
  view: "global" as MainView,
  /** Set by the shot camera while it's the main view; the scene's render pass draws from it. */
  povCamera: null as Camera | null,
  /** Look through the shot camera: it fills the screen, the pads and mouse drive it, the global view moves to the corner. */
  setView(view: MainView) {
    this.view = this.shot.present ? view : "global";
    if (this.view === "shot") this.drive = "shot";
    this.orbitEnabled = this.view === "global";
    emit();
  },
  toggleView() { this.setView(this.view === "shot" ? "global" : "shot"); },
  /** What the pads drive, as one three-way switch: the global camera, the shot camera, or moving through it. */
  get mode(): RigMode { return this.view === "shot" ? "through" : this.drive === "shot" ? "shot" : "global"; },
  setMode(mode: RigMode) {
    if (mode === "through") { this.setView("shot"); return; }
    this.view = "global"; this.orbitEnabled = true;
    this.setDrive(mode === "shot" ? "shot" : "explorer");
  },
  shot: { present: false, fov: 48, aspect: "16:9", pose: null } as ShotState,
  setDrive(drive: Drive) { this.drive = this.shot.present ? drive : "explorer"; emit(); },
  toggleDrive() { this.setDrive(this.drive === "shot" ? "explorer" : "shot"); },
  setOrbitEnabled(on: boolean) { this.orbitEnabled = on; emit(); },
  /** Drop the shot camera into the world a little ahead of the global camera, aimed the same way. */
  addShot() { this.shot = { ...this.shot, present: true }; shotCommand = "add"; this.drive = "shot"; emit(); },
  removeShot() { this.shot = { ...this.shot, present: false, pose: null }; this.drive = "explorer"; this.view = "global"; this.orbitEnabled = true; this.povCamera = null; emit(); },
  /** Move the shot camera to exactly where the global camera is looking from. */
  shotFromView() { if (this.shot.present) { shotCommand = "fromView"; emit(); } },
  takeShotCommand() { const next = shotCommand; shotCommand = null; return next; },
  /** Turn the shot camera in place to a compass heading and pitch, in degrees. */
  aimShot(heading: number, pitch: number) { if (this.shot.present) { shotAim = { heading, pitch }; emit(); } },
  takeShotAim() { const next = shotAim; shotAim = null; return next; },
  setShotFov(fov: number) { this.shot = { ...this.shot, fov }; emit(); },
  setShotAspect(aspect: ShotAspect) { this.shot = { ...this.shot, aspect }; emit(); },
  publishShot(pose: ShotPose) { this.shot = { ...this.shot, pose }; emit(); },
  /** Fly the global camera to the shot camera's exact view. */
  lookThrough() {
    const pose = this.shot.pose;
    if (!pose) return;
    const reach = 25;
    this.flyTo({ position: pose.position, target: [pose.position[0] + pose.forward[0] * reach, pose.position[1] + pose.forward[1] * reach, pose.position[2] + pose.forward[2] * reach] });
  },
  hold(move: RigMove, on: boolean) { if (on) this.held.add(move); else this.held.delete(move); emit(); },
  release() { this.held.clear(); this.fast = false; emit(); },
  setFast(on: boolean) { this.fast = on; emit(); },
  setSpeed(value: number) { this.speed = value; emit(); },
  /** Glide to a view over about a second. */
  flyTo(view: CameraView) { fly = { position: [...view.position], target: [...view.target] }; emit(); },
  /** Cut straight to a view. */
  jumpTo(view: CameraView) { jump = { position: [...view.position], target: [...view.target] }; emit(); },
  takeFly() { const next = fly; fly = null; return next; },
  takeJump() { const next = jump; jump = null; return next; },
  publish(next: RigReadout) { readout = next; emit(); },
  getReadout() { return readout; },
  subscribe(listener: Listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
};

export const compassName = (heading: number) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(heading / 45) % 8];

/** The shot camera as code: a fixed page camera with lookAt. */
export function shotAsCode({ position, forward, fov }: ShotPose) {
  const list = (v: number[]) => v.map(n => +n.toFixed(2)).join(", ");
  const at = position.map((p, i) => p + forward[i] * 10);
  return [`camera.position.set(${list(position)});`, `camera.lookAt(${list(at)});`, `camera.fov = ${Math.round(fov)}; camera.updateProjectionMatrix();`].join("\n");
}

/** The view as code, ready to paste into a scene. */
export function viewAsCode({ position, target, fov }: RigReadout) {
  const list = (v: number[]) => v.map(n => +n.toFixed(2)).join(", ");
  return [
    `camera.position.set(${list(position)});`,
    `controls.target.set(${list(target)}); // or camera.lookAt(${list(target)})`,
    `camera.fov = ${Math.round(fov)}; camera.updateProjectionMatrix();`,
  ].join("\n");
}
