"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  Color,
  DoubleSide,
  QuadraticBezierCurve3,
  Shape,
  TubeGeometry,
  Vector3,
  type ShaderMaterial,
} from "three";
import { makeShellTexture } from "./shell-geometry";

type SceneProps = { moving: boolean; dark: boolean };

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // The shore spans the card, independently of the objects' angled camera.
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;
const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uSand;
  uniform vec3 uWater;
  uniform vec3 uFoam;
  uniform float uDark;
  uniform float uMobile;
  void main() {
    float grain = fract(sin(dot(floor(vUv * 1900.0), vec2(127.1, 311.7))) * 43758.5453);
    float edge = mix(1.115 - vUv.x, 0.24 - vUv.x * 0.20, uMobile);
    edge += sin(vUv.x * 8.0 + uTime * 0.12) * 0.012;
    float wash = sin(uTime * 0.38) * 0.01;
    float shore = vUv.y - edge - wash;
    float water = 1.0 - smoothstep(-0.025, 0.035, shore);
    float detail = mix(0.012, 0.002, uDark);
    vec3 color = mix(uSand + (grain - 0.5) * detail, uWater, water);
    // Successive wave crests advance inland, then dissolve on the sand.
    float phase = fract(shore * 14.0 - uTime * 0.09 + sin(vUv.x * 15.0) * 0.025);
    float crest = pow(1.0 - phase, 36.0);
    float waveZone = smoothstep(-0.30, -0.18, shore) * (1.0 - smoothstep(-0.025, 0.02, shore));
    float clearCopy = mix(smoothstep(0.38, 0.60, vUv.x), 1.0, uMobile);
    color = mix(color, uFoam, crest * waveZone * clearCopy * 0.5);
    float foam = exp(-abs(shore) * 160.0);
    color = mix(color, uFoam, foam * 0.55);
    // The old model-sized tile is now the most transparent part of one shore.
    vec2 center = mix(vec2(0.74, 0.56), vec2(0.5, 0.29), uMobile);
    vec2 radius = mix(vec2(0.30, 0.46), vec2(0.65, 0.26), uMobile);
    float modelZone = 1.0 - smoothstep(0.35, 1.0, length((vUv - center) / radius));
    float alpha = mix(0.72, 0.30, modelZone);
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Shore({ moving, dark, mobile }: SceneProps & { mobile: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const time = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSand: { value: new Color(dark ? "#414943" : "#eee0bc") },
      uWater: { value: new Color(dark ? "#245761" : "#9fc4c5") },
      uFoam: { value: new Color(dark ? "#c7ddd2" : "#f6f6e8") },
      uDark: { value: dark ? 1 : 0 },
      uMobile: { value: mobile ? 1 : 0 },
    }),
    [dark, mobile],
  );
  useFrame((_, delta) => {
    if (!moving || !material.current) return;
    time.current += Math.min(delta, 0.05);
    material.current.uniforms.uTime.value = time.current;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        toneMapped={dark}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function Bucket() {
  const handle = useMemo(
    () =>
      new TubeGeometry(
        new QuadraticBezierCurve3(
          new Vector3(-0.62, 1.06, 0),
          new Vector3(0, 2.55, 0),
          new Vector3(0.62, 1.06, 0),
        ),
        40,
        0.035,
        8,
        false,
      ),
    [],
  );
  useEffect(() => () => handle.dispose(), [handle]);
  return (
    <group position={[-1.85, 0, 0.45]} rotation={[0, -0.3, -0.075]}>
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.64, 0.48, 1.12, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#cf7659"
          roughness={0.48}
          clearcoat={0.18}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 48]} />
        <meshStandardMaterial color="#ae6247" />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.64, 0.035, 8, 48]} />
        <meshStandardMaterial color="#e89d78" roughness={0.55} />
      </mesh>
      <mesh geometry={handle} dispose={null}>
        <meshStandardMaterial color="#f7edda" roughness={0.58} />
      </mesh>
      <group position={[-0.62, 0.85, 0.45]} rotation={[0.1, 0, -0.45]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.15, 12]} />
          <meshStandardMaterial color="#317b82" />
        </mesh>
        <mesh position={[0, -0.43, 0]} scale={[1, 1, 0.16]}>
          <capsuleGeometry args={[0.13, 0.19, 4, 12]} />
          <meshStandardMaterial color="#317b82" />
        </mesh>
        <mesh position={[0, 0.94, 0]}>
          <torusGeometry args={[0.12, 0.035, 8, 20]} />
          <meshStandardMaterial color="#317b82" />
        </mesh>
      </group>
    </group>
  );
}

function Castle({ dark }: { dark: boolean }) {
  const texture = useMemo(() => makeShellTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const sand = dark ? "#c2ad86" : "#dcc395";
  const door = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.18, 0);
    shape.lineTo(-0.18, 0.3);
    shape.absarc(0, 0.3, 0.18, Math.PI, 0, true);
    shape.lineTo(0.18, 0);
    shape.closePath();
    return shape;
  }, []);
  return (
    <group position={[1.0, 0, -0.5]} rotation={[0, -0.15, 0]}>
      <mesh position={[0, 0.1, 0]} scale={[1.2, 0.1, 1]}>
        <sphereGeometry args={[1.35, 32, 12]} />
        <meshStandardMaterial color={sand} map={texture} roughness={1} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.55, 0.85, 1.25]} />
        <meshStandardMaterial color={sand} map={texture} roughness={1} />
      </mesh>
      <mesh position={[0, 0.1, 0.632]}>
        <shapeGeometry args={[door]} />
        <meshBasicMaterial color="#796145" />
      </mesh>
      {[-0.76, 0.76].flatMap((x) =>
        [-0.58, 0.58].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.25, 0.34, 1.38, 32]} />
              <meshStandardMaterial color={sand} map={texture} roughness={1} />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * Math.PI) / 3;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * 0.23,
                    1.48,
                    Math.sin(angle) * 0.23,
                  ]}
                  rotation={[0, -angle, 0]}
                >
                  <boxGeometry args={[0.15, 0.22, 0.13]} />
                  <meshStandardMaterial
                    color={sand}
                    map={texture}
                    roughness={1}
                  />
                </mesh>
              );
            })}
          </group>
        )),
      )}
      {[-0.42, 0, 0.42].map((x) => (
        <mesh key={x} position={[x, 1.02, 0.51]}>
          <boxGeometry args={[0.23, 0.18, 0.22]} />
          <meshStandardMaterial color={sand} map={texture} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 1.05, -0.05]}>
        <cylinderGeometry args={[0.44, 0.53, 1.65, 32]} />
        <meshStandardMaterial color={sand} map={texture} roughness={1} />
      </mesh>
      <mesh position={[0, 2.02, -0.05]}>
        <coneGeometry args={[0.52, 0.65, 32]} />
        <meshStandardMaterial color={sand} map={texture} roughness={1} />
      </mesh>
    </group>
  );
}

function BeachObjects({ dark, mobile }: { dark: boolean; mobile: boolean }) {
  const { camera, viewport } = useThree();
  const position = useMemo(() => {
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    return right
      .multiplyScalar(mobile ? 0 : viewport.width * 0.235)
      .add(up.multiplyScalar(viewport.height * (mobile ? -0.28 : 0.015)));
  }, [camera, viewport.width, viewport.height, mobile]);
  return (
    <group position={position} scale={mobile ? 0.93 : 1}>
      <Bucket />
      <Castle dark={dark} />
    </group>
  );
}

function subscribeToMobile(callback: () => void) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function BeachCastleScene({ moving, dark }: SceneProps) {
  const mobile = useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
  return (
    <Canvas
      orthographic
      camera={{ position: [5, 6, 8], zoom: 49, near: 0.1, far: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.25, 0)}
      dpr={[1, 1.5]}
      frameloop={moving ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={null}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[-4, 7, 5]} intensity={2.4} color="#fff0d6" />
      <Shore moving={moving} dark={dark} mobile={mobile} />
      <BeachObjects dark={dark} mobile={mobile} />
    </Canvas>
  );
}
