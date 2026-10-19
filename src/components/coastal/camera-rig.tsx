"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, PerspectiveCamera, Spherical, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CAMERA_PRESETS, cameraRig, easeVelocity, stillVelocity, wantedVelocity, type CameraView, type RigMove, type Velocity } from "./camera-rig-store";

/*
 * The explorer camera. Mouse and touch orbit through OrbitControls; the arrow
 * pads and keys move through the shared cameraRig store with eased velocity,
 * so a held arrow accelerates, glides, and settles instead of stepping.
 * Presets fly there over about a second. Runs on R3F's demand loop and asks
 * for frames only while something is moving.
 */

const KEYS: Record<string, RigMove> = {
  KeyW: "forward", KeyS: "back", KeyA: "left", KeyD: "right", KeyE: "up", KeyQ: "down",
  ArrowLeft: "orbitLeft", ArrowRight: "orbitRight", ArrowUp: "tiltUp", ArrowDown: "tiltDown",
  Equal: "zoomIn", Minus: "zoomOut", NumpadAdd: "zoomIn", NumpadSubtract: "zoomOut",
};
const UP = new Vector3(0, 1, 0);
const FLIGHT_SECONDS = 1.3;
const MIN_HEIGHT = .4;

type Flight = { from: CameraView; to: CameraView; t: number };

const typing = (target: EventTarget | null) =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
  || (target instanceof HTMLElement && target.isContentEditable);

export function CameraRig({ start = CAMERA_PRESETS.Overview }: { start?: CameraView }) {
  const getScene = useThree(state => state.get);
  const controls = useRef<OrbitControls | null>(null);
  const velocity = useRef<Velocity>(stillVelocity());
  const flight = useRef<Flight | null>(null);
  const published = useRef(0);

  useEffect(() => {
    const { camera, gl, invalidate } = getScene();
    camera.position.set(...start.position);
    // A .5 near plane gives thin stacked surfaces (pool coping, water) 5x the depth precision of .1.
    if (camera instanceof PerspectiveCamera) { camera.near = .5; camera.far = 600; camera.updateProjectionMatrix(); }
    const orbit = new OrbitControls(camera, gl.domElement);
    orbit.target.set(...start.target);
    orbit.minDistance = 2;
    orbit.maxDistance = 260;
    orbit.maxPolarAngle = Math.PI * .49;
    orbit.screenSpacePanning = false;
    orbit.enableDamping = true;
    orbit.dampingFactor = .1;
    const onChange = () => invalidate();
    const onStart = () => { flight.current = null; };
    orbit.addEventListener("change", onChange);
    orbit.addEventListener("start", onStart);
    orbit.update();
    controls.current = orbit;

    const down = (event: KeyboardEvent) => {
      if (typing(event.target)) return;
      if (event.key === "Shift") cameraRig.setFast(true);
      const move = KEYS[event.code];
      if (!move) return;
      event.preventDefault();
      cameraRig.hold(move, true);
    };
    const up = (event: KeyboardEvent) => {
      if (event.key === "Shift") cameraRig.setFast(false);
      const move = KEYS[event.code];
      if (move) cameraRig.hold(move, false);
    };
    const release = () => cameraRig.release();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", release);
    // Any change in the store (a held arrow, a preset) wakes the demand loop.
    const unsubscribe = cameraRig.subscribe(invalidate);
    invalidate();
    return () => {
      unsubscribe();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", release);
      orbit.removeEventListener("change", onChange);
      orbit.removeEventListener("start", onStart);
      orbit.dispose();
      controls.current = null;
    };
  }, [getScene, start]);

  useFrame((_, rawDelta) => {
    const orbit = controls.current;
    if (!orbit) return;
    const { camera, invalidate } = getScene();
    const dt = Math.min(rawDelta, .05);
    let active = false;
    orbit.enabled = cameraRig.orbitEnabled;

    const jump = cameraRig.takeJump();
    if (jump) {
      camera.position.set(...jump.position);
      orbit.target.set(...jump.target);
      flight.current = null;
      active = true;
    }
    const fly = cameraRig.takeFly();
    if (fly) flight.current = { from: { position: camera.position.toArray(), target: orbit.target.toArray() }, to: fly, t: 0 };

    // The pads drive camera 2 when it's selected; camera 1 then only answers the mouse and flights.
    const want = cameraRig.drive === "explorer" ? wantedVelocity(cameraRig.held) : stillVelocity();
    if (Object.values(want).some(Boolean)) flight.current = null;
    const v = velocity.current;
    const distance = camera.position.distanceTo(orbit.target);
    if (easeVelocity(v, want, dt)) {
      active = true;
      const boost = cameraRig.speed * (cameraRig.fast ? 3 : 1);
      // Move speed follows the distance to the target: fast across the town, gentle close to a sign.
      const step = MathUtils.clamp(distance * .7, 2.5, 70) * boost * dt;
      const forward = new Vector3().subVectors(orbit.target, camera.position);
      forward.y = 0;
      if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
      forward.normalize();
      const right = new Vector3().crossVectors(forward, UP);
      const delta = new Vector3().addScaledVector(forward, v.forward * step).addScaledVector(right, v.right * step);
      delta.y += v.rise * step * .6;
      camera.position.add(delta);
      orbit.target.add(delta);
      if (camera.position.y < MIN_HEIGHT) {
        const lift = MIN_HEIGHT - camera.position.y;
        camera.position.y += lift;
        orbit.target.y += lift;
      }
      // Orbit and tilt around the target; zoom toward it.
      const spherical = new Spherical().setFromVector3(new Vector3().subVectors(camera.position, orbit.target));
      spherical.theta -= v.orbit * 1.3 * boost * dt;
      spherical.phi = MathUtils.clamp(spherical.phi + v.tilt * .9 * boost * dt, .06, orbit.maxPolarAngle);
      spherical.radius = MathUtils.clamp(spherical.radius * Math.exp(-v.zoom * 1.1 * boost * dt), orbit.minDistance, orbit.maxDistance);
      camera.position.setFromSpherical(spherical).add(orbit.target);
    }

    const trip = flight.current;
    if (trip) {
      active = true;
      trip.t = Math.min(1, trip.t + dt / FLIGHT_SECONDS);
      const s = trip.t * trip.t * (3 - 2 * trip.t);
      const hop = new Vector3(...trip.from.position).distanceTo(new Vector3(...trip.to.position));
      // A long hop arcs up a little in the middle so it doesn't scrape rooftops.
      const lift = Math.sin(s * Math.PI) * Math.min(12, hop * .12);
      camera.position.set(
        MathUtils.lerp(trip.from.position[0], trip.to.position[0], s),
        MathUtils.lerp(trip.from.position[1], trip.to.position[1], s) + lift,
        MathUtils.lerp(trip.from.position[2], trip.to.position[2], s),
      );
      orbit.target.set(
        MathUtils.lerp(trip.from.target[0], trip.to.target[0], s),
        MathUtils.lerp(trip.from.target[1], trip.to.target[1], s),
        MathUtils.lerp(trip.from.target[2], trip.to.target[2], s),
      );
      if (trip.t >= 1) flight.current = null;
    }

    const settled = !orbit.update() && !active;
    if (!settled) invalidate();

    const now = performance.now();
    if (!settled ? now - published.current > 90 : now - published.current > 400) {
      published.current = now;
      const dir = new Vector3().subVectors(orbit.target, camera.position).normalize();
      cameraRig.publish({
        position: camera.position.toArray(),
        target: orbit.target.toArray(),
        heading: (MathUtils.radToDeg(Math.atan2(dir.x, -dir.z)) + 360) % 360,
        pitch: MathUtils.radToDeg(Math.asin(MathUtils.clamp(dir.y, -1, 1))),
        distance: camera.position.distanceTo(orbit.target),
        fov: camera instanceof PerspectiveCamera ? camera.fov : 0,
      });
    }
  });
  return null;
}
