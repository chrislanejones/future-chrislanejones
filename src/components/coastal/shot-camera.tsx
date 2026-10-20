"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Euler, MathUtils, PerspectiveCamera, Quaternion, Vector3, type Group } from "three";
import { cameraRig, easeVelocity, SHOT_ASPECTS, stillVelocity, viewfinderRect, wantedVelocity, type Velocity } from "./camera-rig-store";

/*
 * The shot camera. A small camera model in the world that the pads and keys drive
 * when it's selected: it flies along its own aim, turns in place, and the
 * zoom keys change its field of view. The viewfinder in the corner renders
 * the scene from it after the main pass.
 */

const FORWARD = new Vector3(0, 0, -1);
const MIN_HEIGHT = .3;

export function ShotCamera() {
  const getScene = useThree(state => state.get);
  const shot = useSyncExternalStore(cameraRig.subscribe, () => cameraRig.shot, () => cameraRig.shot);
  const group = useRef<Group>(null);
  const lensRef = useRef<PerspectiveCamera | null>(null);
  if (lensRef.current == null) lensRef.current = new PerspectiveCamera(48, 16 / 9, .5, 700);
  const velocity = useRef<Velocity>(stillVelocity());
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const published = useRef(0);
  const dirty = useRef(true);

  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    lens.fov = shot.fov;
    lens.updateProjectionMatrix();
    dirty.current = true;
    getScene().invalidate();
  }, [shot.fov, getScene]);

  // C switches which camera the pads drive; V looks through the shot camera.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      if (event.code === "KeyC") cameraRig.toggleDrive();
      if (event.code === "KeyV") cameraRig.toggleView();
      if (event.code === "Escape" && cameraRig.view === "shot") cameraRig.setView("global");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Looking through it: the lens becomes the main camera, drag looks around, scroll zooms the lens.
  const view = useSyncExternalStore(cameraRig.subscribe, () => cameraRig.view, () => cameraRig.view);
  useEffect(() => {
    if (view !== "shot" || !shot.present) { cameraRig.povCamera = null; getScene().invalidate(); return; }
    cameraRig.povCamera = lensRef.current;
    const { gl, invalidate } = getScene();
    const canvas = gl.domElement;
    let drag: { x: number; y: number } | null = null;
    const down = (event: PointerEvent) => { if (event.button === 0 || event.button === 2) drag = { x: event.clientX, y: event.clientY }; };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const scale = (cameraRig.shot.fov / 48) * .0045;
      euler.current.y += (event.clientX - drag.x) * scale;
      euler.current.x = MathUtils.clamp(euler.current.x + (event.clientY - drag.y) * scale, -1.45, 1.45);
      drag = { x: event.clientX, y: event.clientY };
      group.current?.quaternion.setFromEuler(euler.current);
      dirty.current = true;
      invalidate();
    };
    const up = () => { drag = null; };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraRig.setShotFov(MathUtils.clamp(cameraRig.shot.fov * Math.exp(event.deltaY * .0012), 10, 110));
    };
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    canvas.addEventListener("wheel", wheel, { passive: false });
    invalidate();
    return () => {
      cameraRig.povCamera = null;
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      canvas.removeEventListener("wheel", wheel);
      invalidate();
    };
  }, [view, shot.present, getScene]);

  useFrame((_, rawDelta) => {
    const g = group.current;
    if (!shot.present || !g) return;
    const { camera, invalidate } = getScene();
    const dt = Math.min(rawDelta, .05);

    const command = cameraRig.takeShotCommand();
    if (command) {
      // Start in front of camera 1, aimed the same way; "from view" sits exactly where camera 1 is.
      const aim = new Vector3();
      camera.getWorldDirection(aim);
      const ahead = command === "add" ? Math.max(4, cameraRig.getReadout().distance * .35) : 0;
      g.position.copy(camera.position).addScaledVector(aim, ahead);
      euler.current.setFromQuaternion(camera.quaternion, "YXZ");
      euler.current.z = 0;
      g.quaternion.setFromEuler(euler.current);
      velocity.current = stillVelocity();
      dirty.current = true;
    }

    // Turned from the panel: heading is clockwise from north (−Z), so yaw is its negative.
    const aim = cameraRig.takeShotAim();
    if (aim) {
      euler.current.set(MathUtils.degToRad(MathUtils.clamp(aim.pitch, -83, 83)), -MathUtils.degToRad(aim.heading), 0, "YXZ");
      g.quaternion.setFromEuler(euler.current);
      dirty.current = true;
      invalidate();
    }

    // Drive it.
    const want = cameraRig.drive === "shot" ? wantedVelocity(cameraRig.held) : stillVelocity();
    const v = velocity.current;
    if (easeVelocity(v, want, dt)) {
      const boost = cameraRig.speed * (cameraRig.fast ? 3 : 1);
      // Fly along the aim; speed follows height so street level stays gentle.
      const step = MathUtils.clamp(2 + g.position.y * .6, 2.5, 60) * boost * dt;
      const forward = new Vector3(0, 0, -1).applyQuaternion(g.quaternion);
      const right = new Vector3(1, 0, 0).applyQuaternion(g.quaternion);
      right.y = 0;
      right.normalize();
      g.position.addScaledVector(forward, v.forward * step).addScaledVector(right, v.right * step);
      g.position.y = Math.max(MIN_HEIGHT, g.position.y + v.rise * step * .6);
      // Turn in place; the zoom keys are the zoom lens.
      euler.current.y -= v.orbit * 1.1 * boost * dt;
      euler.current.x = MathUtils.clamp(euler.current.x + v.tilt * .8 * boost * dt, -1.45, 1.45);
      g.quaternion.setFromEuler(euler.current);
      if (v.zoom) cameraRig.setShotFov(MathUtils.clamp(cameraRig.shot.fov * Math.exp(-v.zoom * .9 * dt), 10, 110));
      dirty.current = true;
      invalidate();
    }

    // The model keeps one size on screen, and hides when the global camera sits inside it.
    const distance = camera.position.distanceTo(g.position);
    g.scale.setScalar(Math.max(.35, distance * .022));
    g.visible = cameraRig.view !== "shot" && distance > g.scale.x * 1.6;
    const lensNow = lensRef.current;
    if (lensNow) {
      // Keep the lens on the model every frame, so the main view (when looking through it) is current.
      lensNow.position.copy(g.position);
      lensNow.quaternion.copy(g.quaternion);
      if (cameraRig.view === "shot") {
        const { size } = getScene();
        lensNow.aspect = size.width / Math.max(1, size.height);
        lensNow.updateProjectionMatrix();
      }
    }

    const lens = lensRef.current;
    const now = performance.now();
    if (lens && dirty.current && now - published.current > 90) {
      published.current = now;
      dirty.current = false;
      const forward = FORWARD.clone().applyQuaternion(g.quaternion);
      cameraRig.publishShot({
        position: g.position.toArray(),
        forward: forward.toArray(),
        heading: (MathUtils.radToDeg(Math.atan2(forward.x, -forward.z)) + 360) % 360,
        pitch: MathUtils.radToDeg(Math.asin(MathUtils.clamp(forward.y, -1, 1))),
        fov: lens.fov,
      });
    }
  });

  // The corner picture, after the main pass: the shot camera's view, or (while
  // looking through it) the global camera's view with the shot camera visible in it.
  useFrame(({ gl, scene, size, camera }) => {
    const g = group.current, lens = lensRef.current;
    if (!shot.present || !g || !lens) return;
    const through = cameraRig.view === "shot";
    const rect = viewfinderRect(size.width, size.height, through ? null : SHOT_ASPECTS[shot.aspect]);
    const corner = through ? camera : lens;
    if (!through) {
      lens.position.copy(g.position);
      lens.quaternion.copy(g.getWorldQuaternion(new Quaternion()));
      lens.aspect = rect.w / rect.h;
      lens.updateProjectionMatrix();
    }
    const wasVisible = g.visible;
    g.visible = through;
    const autoClear = gl.autoClear;
    gl.autoClear = false;
    gl.setScissorTest(true);
    gl.setViewport(rect.x, rect.y, rect.w, rect.h);
    gl.setScissor(rect.x, rect.y, rect.w, rect.h);
    gl.clear(true, true, false);
    gl.render(scene, corner);
    gl.setScissorTest(false);
    if (through) {
      lens.aspect = size.width / Math.max(1, size.height);
      lens.updateProjectionMatrix();
    }
    gl.setViewport(0, 0, size.width, size.height);
    gl.autoClear = autoClear;
    g.visible = wasVisible;
  }, 2);

  if (!shot.present) return null;
  const body = <meshStandardMaterial color="#1f2426" roughness={.55} metalness={.25} />;
  return (
    <group ref={group}>
      <mesh castShadow><boxGeometry args={[1.2, .8, .55]} />{body}</mesh>
      <mesh position={[.56, -.02, .06]} castShadow><boxGeometry args={[.3, .74, .62]} /><meshStandardMaterial color="#2a2f31" roughness={.8} /></mesh>
      <mesh position={[0, .5, -.02]} castShadow><boxGeometry args={[.46, .26, .4]} />{body}</mesh>
      <mesh position={[-.4, .46, .05]}><cylinderGeometry args={[.08, .08, .08, 16]} /><meshStandardMaterial color="#c8c2b4" metalness={.6} roughness={.3} /></mesh>
      <mesh position={[0, .02, -.62]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.3, .32, .7, 28]} />{body}</mesh>
      <mesh position={[0, .02, -.98]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.23, .23, .03, 28]} /><meshStandardMaterial color="#4c86b4" metalness={.7} roughness={.15} /></mesh>
      <mesh position={[.45, .32, .3]}><sphereGeometry args={[.05, 10, 8]} /><meshStandardMaterial color="#e0573f" emissive="#e0573f" emissiveIntensity={.8} /></mesh>
    </group>
  );
}
