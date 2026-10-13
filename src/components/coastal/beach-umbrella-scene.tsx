"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, DoubleSide, type Group } from "three";

function makeCanopyPanel(panel: number) {
  const positions: number[] = [];
  const indices: number[] = [];
  const rings = 12;
  const segments = 12;
  for (let ring = 0; ring <= rings; ring++) {
    const radius = ring / rings;
    for (let segment = 0; segment <= segments; segment++) {
      const fraction = segment / segments;
      const angle = ((panel + fraction) * Math.PI) / 4;
      const scallop = Math.sin(fraction * Math.PI);
      const length = radius * (1.36 - scallop * 0.035 * Math.pow(radius, 4));
      positions.push(
        Math.cos(angle) * length,
        2.25 -
          Math.pow(radius, 1.65) * 0.57 -
          scallop * 0.07 * Math.pow(radius, 4),
        Math.sin(angle) * length,
      );
      if (ring < rings && segment < segments) {
        const a = ring * (segments + 1) + segment;
        const b = a + segments + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function BeachUmbrella({ moving }: { moving: boolean }) {
  const width = useThree((state) => state.size.width);
  const scale = Math.min(1, width / 150);
  const group = useRef<Group>(null);
  const time = useRef(0);
  const panels = useMemo(
    () => Array.from({ length: 8 }, (_, index) => makeCanopyPanel(index)),
    [],
  );
  useEffect(() => () => panels.forEach((panel) => panel.dispose()), [panels]);
  useFrame((_, delta) => {
    if (!moving || !group.current) return;
    time.current += Math.min(delta, 0.05);
    group.current.rotation.z = -0.1 + Math.sin(time.current * 0.45) * 0.025;
  });
  return (
    <group
      ref={group}
      rotation={[0, 0.2, -0.1]}
      position={[0, -0.9 * scale, 0]}
      scale={scale}
    >
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.022, 0.033, 2.24, 12]} />
        <meshStandardMaterial color="#b99165" roughness={0.85} />
      </mesh>
      {panels.map((geometry, index) => (
        <mesh key={index} geometry={geometry} dispose={null}>
          <meshStandardMaterial
            color={index % 2 ? "#f4e4c8" : "#ce765d"}
            roughness={0.9}
            side={DoubleSide}
          />
        </mesh>
      ))}
      <mesh position={[0, 2.27, 0]}>
        <sphereGeometry args={[0.047, 12, 8]} />
        <meshStandardMaterial color="#a95d49" />
      </mesh>
      <mesh position={[0.07, -0.018, 0.05]} scale={[1, 0.08, 0.6]}>
        <sphereGeometry args={[0.64, 24, 12]} />
        <meshStandardMaterial color="#dfc99e" roughness={1} />
      </mesh>
    </group>
  );
}

export default function BeachUmbrellaScene({
  moving,
}: {
  moving: boolean;
  dark: boolean;
}) {
  return (
    <Canvas
      orthographic
      camera={{ position: [3, 3, 5], zoom: 43 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
      dpr={[1, 1.5]}
      frameloop={moving ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={null}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 5, 4]} intensity={2} color="#fff0da" />
      <BeachUmbrella moving={moving} />
    </Canvas>
  );
}
