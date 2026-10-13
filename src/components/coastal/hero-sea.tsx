"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { TextureLoader, Vector2, type ShaderMaterial } from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uPhoto;
  uniform vec2 uCrop;
  uniform vec2 uPosition;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    // Match the original image's object-fit: cover and responsive object-position.
    vec2 uv = vUv * uCrop + (1.0 - uCrop) * uPosition;
    float y = 1.0 - uv.y;
    // Trace the wet shoreline in this photograph, in source-image coordinates.
    float shoreline = 0.653 + 0.177 * y + sin(y * 7.0) * 0.007;
    float distanceToShore = uv.x - shoreline;
    float water = smoothstep(-0.012, 0.022, distanceToShore);
    float surf = 1.0 - smoothstep(0.02, 0.15, distanceToShore);
    float swell = sin(uTime * 0.72 + y * 9.0);
    float ripple = sin(distanceToShore * 110.0 + uTime * 1.1 + sin(y * 19.0));
    vec2 drift = vec2(
      swell * 0.0045 + ripple * 0.0018,
      sin(y * 32.0 + uTime * 0.55) * 0.0012
    ) * water * (0.35 + surf * 0.65);
    vec3 photo = texture2D(uPhoto, clamp(uv + drift, 0.001, 0.999)).rgb;
    // A faint light change follows the existing foam, without drawing new wave lines.
    photo *= 1.0 + ripple * surf * water * 0.018;
    gl_FragColor = vec4(photo, water);
  }
`;

function Water({ source, moving, mobile }: { source: string; moving: boolean; mobile: boolean }) {
  const texture = useLoader(TextureLoader, source);
  const { width, height } = useThree((state) => state.size);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => {
    const image = texture.image as HTMLImageElement;
    const scale = Math.max(width / image.width, height / image.height);
    return {
      uPhoto: { value: texture },
      uCrop: { value: new Vector2(width / (image.width * scale), height / (image.height * scale)) },
      // Texture Y points up, whereas CSS object-position Y points down.
      uPosition: { value: new Vector2(mobile ? 0.63 : 0.7, mobile ? 0.5 : 0.44) },
      uTime: { value: 0 },
    };
  }, [texture, width, height, mobile]);
  useFrame((_, delta) => {
    if (moving && material.current) {
      material.current.uniforms.uTime.value += Math.min(delta, 0.05);
    }
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function HeroSea(props: { source: string; moving: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={props.moving ? "always" : "demand"}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
    >
      <Suspense fallback={null}>
        <Water {...props} />
      </Suspense>
    </Canvas>
  );
}
