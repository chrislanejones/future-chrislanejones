"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  Color,
  DoubleSide,
  type Group,
  type Points,
  type ShaderMaterial,
} from "three";
import {
  makeShellGeometries,
  makeShellTexture,
  type ShellKind,
} from "./shell-geometry";

type SceneProps = { moving: boolean; dark: boolean };

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fine sand, tide lines, and shallow-water caustics are generated on the GPU.
// No large texture downloads or postprocessing passes are needed.
const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uDetail;
  uniform float uDark;
  uniform float uCaustics;
  uniform vec3 uSand;
  uniform vec3 uWetSand;
  uniform vec3 uWater;
  uniform vec3 uFoam;
  float grain(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);
    float ripple = sin(p.y * 165.0 + sin(p.x * 23.0) * 1.8);
    float sandNoise = grain(floor(p * 1700.0));
    vec3 sand = uSand + ripple * uDetail * 0.22 + (sandNoise - 0.5) * uDetail;
    // Warm mineral grains and irregular wind ridges give night sand its own
    // surface, while keeping contrast low enough for the writing above it.
    float ridge = sin(p.y * 105.0 + sin(p.x * 8.0 + p.y * 3.0) * 3.5);
    float mineral = grain(floor(p * 680.0) + 19.3) - 0.5;
    vec3 nightSand = uSand + vec3(1.0, 0.86, 0.65)
      * (ridge * 0.004 + (sandNoise - 0.5) * 0.020 + mineral * 0.009);
    sand = mix(sand, nightSand, uDark);

    // The tide curls around the upper-right corner; the reading area stays calm.
    float shore = vUv.x + vUv.y * 0.26 - 1.06
      + sin(vUv.y * 4.8 + uTime * 0.15) * 0.016;
    float tide = sin(uTime * 0.22 + vUv.y * 2.0) * 0.016;
    float wet = smoothstep(-0.09, 0.03, shore + tide);
    vec3 color = mix(sand, uWetSand, wet * 0.55);
    float water = smoothstep(-0.012, 0.044, shore + tide);
    float caustic = pow(0.5 + 0.5 * sin(p.x * 46.0 + sin(p.y * 35.0 + uTime * 0.3) * 2.0), 10.0)
      * pow(0.5 + 0.5 * sin(p.y * 53.0 - uTime * 0.25), 3.0);
    color = mix(color, uWater + caustic * uCaustics, water);
    // Unbroken foam ribbons: each swell has its own angle, curve, and drift.
    float swellA = vUv.x + vUv.y * 0.22 - 1.10
      + sin(vUv.y * 5.5 + uTime * 0.12) * 0.012
      + sin(uTime * 0.19) * 0.013;
    float swellB = vUv.x + vUv.y * 0.31 - 1.22
      + sin(vUv.y * 3.8 - uTime * 0.09) * 0.018
      + sin(uTime * 0.16 + 1.4) * 0.012;
    float foam = exp(-abs(shore + tide + 0.007) * 420.0) * 0.62;
    float wash = exp(-abs(shore + tide + 0.007) * 130.0) * 0.10;
    float waveA = exp(-abs(swellA) * 480.0) * water * 0.38;
    float waveB = exp(-abs(swellB) * 540.0) * water * 0.28;
    color = mix(color, uFoam, clamp(foam + wash + waveA + waveB, 0.0, 0.8));
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Sand({ moving, dark }: SceneProps) {
  const { width, height } = useThree((state) => state.viewport);
  const material = useRef<ShaderMaterial>(null);
  const time = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: width / height },
      uDetail: { value: dark ? 0.0025 : 0.055 },
      uDark: { value: dark ? 1 : 0 },
      uCaustics: { value: dark ? 0.012 : 0.07 },
      uSand: { value: new Color(dark ? "#514737" : "#eee4d2") },
      uWetSand: { value: new Color(dark ? "#343b34" : "#c3c8b4") },
      uWater: { value: new Color(dark ? "#346c75" : "#8cbdba") },
      uFoam: { value: new Color(dark ? "#c7ddd2" : "#f9fcf1") },
    }),
    [dark, width, height],
  );

  useFrame((_, delta) => {
    if (!moving || !material.current) return;
    time.current += Math.min(delta, 0.05);
    material.current.uniforms.uTime.value = time.current;
  });

  return (
    <mesh position={[0, 0, -0.6]} scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        toneMapped={false}
      />
    </mesh>
  );
}

const shells: {
  x: number;
  y: number;
  size: number;
  turn: number;
  kind: ShellKind;
  tint: string;
}[] = [
  {
    x: 0.055,
    y: 0.76,
    size: 0.72,
    turn: -0.4,
    kind: "scallop",
    tint: "#fff6ee",
  },
  {
    x: 0.72,
    y: 0.82,
    size: 0.96,
    turn: 0.6,
    kind: "scallop",
    tint: "#edcdc1",
  },
  { x: 0.01, y: 0.32, size: 0.58, turn: 1.6, kind: "clam", tint: "#f2e8df" },
  { x: 0.77, y: 0.38, size: 0.73, turn: -1.1, kind: "spiral", tint: "#fff0d9" },
  { x: 0.15, y: 0.1, size: 0.82, turn: 0.7, kind: "spiral", tint: "#f6e7d2" },
  { x: 0.73, y: 0.085, size: 0.62, turn: -0.6, kind: "clam", tint: "#eee0d5" },
  { x: 0.54, y: 0.93, size: 0.45, turn: 2.3, kind: "scallop", tint: "#fcefe5" },
  { x: 0.63, y: 0.47, size: 0.4, turn: 0.2, kind: "clam", tint: "#e8d7c8" },
];

// The three-column desktop layout leaves a stretch of sand below Latest writing.
const desktopShells: typeof shells = [
  ...shells.map((shell, index) =>
    index === 0 ? { ...shell, x: 0.065, y: 0.54 } : shell,
  ),
  { x: 0.085, y: 0.43, size: 0.8, turn: -0.8, kind: "scallop", tint: "#f3d7c7" },
  { x: 0.2, y: 0.48, size: 0.65, turn: 1.1, kind: "spiral", tint: "#f6e7d2" },
  { x: 0.285, y: 0.35, size: 0.68, turn: 0.5, kind: "clam", tint: "#eee0d5" },
  { x: 0.14, y: 0.28, size: 0.57, turn: -1.4, kind: "clam", tint: "#f5ece3" },
  { x: 0.235, y: 0.19, size: 0.86, turn: 0.9, kind: "scallop", tint: "#edcdc1" },
];

function subscribeToDesktop(callback: () => void) {
  const query = matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Shells({ moving, dark }: SceneProps) {
  const desktop = useSyncExternalStore(
    subscribeToDesktop,
    () => matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
  const composition = desktop ? desktopShells : shells;
  const group = useRef<Group>(null);
  const time = useRef(0);
  const { width, height } = useThree((state) => state.viewport);
  const geometries = useMemo(() => makeShellGeometries(), []);
  const texture = useMemo(() => makeShellTexture(), []);
  const scale = Math.min(1, width / 12) * 0.55;

  useEffect(
    () => () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      texture.dispose();
    },
    [geometries, texture],
  );
  useFrame((_, delta) => {
    if (!moving || !group.current) return;
    time.current += Math.min(delta, 0.05);
    group.current.children.forEach((shell, index) => {
      const wave = Math.sin(time.current * 0.35 + index * 1.7);
      shell.rotation.z = composition[index].turn + wave * 0.055;
      shell.rotation.x = wave * 0.055;
      shell.position.y = (composition[index].y - 0.5) * height + wave * 0.035;
    });
  });

  return (
    <group ref={group}>
      {composition.map((shell, index) => (
        <group
          key={index}
          position={[(shell.x - 0.5) * width, (shell.y - 0.5) * height, -0.25]}
          rotation={[0.08, -0.12, shell.turn]}
          scale={shell.size * scale}
        >
          <mesh
            position={[0.025, -0.035, -0.09]}
            scale={[1.04, 1.04, 0.04]}
            geometry={geometries[shell.kind]}
            dispose={null}
          >
            <meshBasicMaterial
              color={dark ? "#08191e" : "#897961"}
              transparent
              opacity={0.13}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={geometries[shell.kind]} dispose={null}>
            <meshPhysicalMaterial
              vertexColors
              color={dark ? "#a3aab5" : shell.tint}
              map={texture}
              roughness={0.72}
              clearcoat={0.12}
              clearcoatRoughness={0.85}
              side={DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Deterministic seeds avoid hydration differences and keep the composition stable.
function seed(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function Particles({ moving, dark }: SceneProps) {
  const points = useRef<Points>(null);
  const time = useRef(0);
  const { width, height } = useThree((state) => state.viewport);
  const positions = useMemo(() => {
    const data = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      data[i * 3] = (seed(i + 1) - 0.5) * width;
      data[i * 3 + 1] = (seed(i + 201) - 0.5) * height;
      data[i * 3 + 2] = 0.2 + seed(i + 401) * 0.7;
    }
    return data;
  }, [width, height]);

  useFrame((_, delta) => {
    if (!moving || !points.current) return;
    time.current += Math.min(delta, 0.05);
    const attribute = points.current.geometry.getAttribute("position");
    for (let i = 0; i < 100; i++) {
      const x =
        (seed(i + 1) * width + time.current * (0.025 + seed(i + 601) * 0.04)) %
        width;
      attribute.setX(i, x - width / 2);
      attribute.setY(
        i,
        (seed(i + 201) - 0.5) * height +
          Math.sin(time.current * 0.3 + i) * 0.09,
      );
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={dark ? "#b9d3ca" : "#ffffff"}
        size={0.027}
        transparent
        opacity={0.52}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function CoastScene({ moving, dark }: SceneProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 14], zoom: 80, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      frameloop={moving ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={null}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[-5, 8, 5]} intensity={2.7} color="#fff4df" />
      <Sand moving={moving} dark={dark} />
      <Shells moving={moving} dark={dark} />
      <Particles moving={moving} dark={dark} />
    </Canvas>
  );
}
