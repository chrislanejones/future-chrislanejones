"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function BighornModel() {
  const { scene } = useGLTF("/models/bighorn/scene.gltf");
  const customTexture = useLoader(
    THREE.TextureLoader,
    "/models/bighorn/textures/BighornSheep_diffuse.png"
  );

  useEffect(() => {
    // Traverse the scene and apply the custom texture to all meshes
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Clone the material to avoid affecting other instances
        child.material = child.material.clone();
        // Apply the custom texture
        child.material.map = customTexture;
        // Ensure the material updates
        child.material.needsUpdate = true;
      }
    });
  }, [scene, customTexture]);

  return (
    <primitive
      object={scene}
      scale={0.1}
      position={[0, -1, 0]}
      rotation={[0, Math.PI * 0.25, 0]}
    />
  );
}

export default function Bighorn3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 40, 8], fov: 45 }}
        style={{ background: "transparent" }}
        shadows
      >
        {/* Ambient light for overall scene brightness */}
        <ambientLight intensity={0.6} />

        {/* Main directional light from top-right (sun-like) */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Fill light from left to soften shadows */}
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />

        {/* Rim light from behind for depth */}
        <directionalLight position={[0, 5, -10]} intensity={0.3} />

        {/* Hemisphere light for natural sky/ground lighting */}
        <hemisphereLight
          color="#ffffff"
          groundColor="#666666"
          intensity={0.5}
        />

        <Suspense fallback={null}>
          <BighornModel />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
