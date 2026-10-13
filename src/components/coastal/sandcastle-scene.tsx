"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, OrthographicCamera, Shape, type Group, type ShaderMaterial, type Texture } from "three";
import { Bucket } from "./beach-castle-scene";
import { makeShellTexture } from "./shell-geometry";
import type { CastlePiece, CastleTool } from "./sandcastle-model";

type Props = {
  pieces: CastlePiece[];
  tool: CastleTool;
  cursor: { x: number; z: number };
  dark: boolean;
  moving: boolean;
  onPlace: (x: number, z: number) => void;
  onAim: (point: { x: number; z: number }) => void;
};
const SPACING = 1.05;
const sandVertex = `
  varying vec2 vUv;
  varying vec2 vScreenUv;
  void main() {
    vUv = position.xy / vec2(14.0, 11.0) + .5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenUv = gl_Position.xy / gl_Position.w * .5 + .5;
  }`;
const sandFragment = `
  varying vec2 vUv; varying vec2 vScreenUv;
  uniform float uTime; uniform float uDetail; uniform vec3 uSand; uniform vec3 uWater;
  void main() {
    float noise = fract(sin(dot(floor(vUv*1700.0),vec2(127.1,311.7)))*43758.5453);
    float ripple=sin(vUv.y*155.0+sin(vUv.x*18.0)*2.0);
    vec3 sand=uSand+(noise-.5)*uDetail+ripple*.003;
    // Keep the sea in the upper-right corner at every canvas aspect ratio.
    vec2 p = vScreenUv;
    float coast = p.x + p.y * .7 - 1.22
      + sin(p.y * 7.0 + uTime * .45) * .018;
    float tide = sin(uTime * .65 + p.y * 3.0) * .022;
    float shore = coast + tide;
    float water = smoothstep(-.018, .025, shore);
    float wet = smoothstep(-.065, .02, shore);
    vec3 wetSand = mix(sand, uWater, .25) * .87;
    vec3 color = mix(sand, wetSand, wet);
    float shimmer = sin(p.x * 65.0 + sin(p.y * 43.0 + uTime) * 2.0)
      * sin(p.y * 52.0 - uTime * .8) * .015;
    color = mix(color, uWater + shimmer, water);
    float foam = exp(-abs(shore + .003) * 210.0) * .72;
    float wash = exp(-abs(shore + .008) * 65.0) * .13;
    float swellA = coast - .07 + sin(p.y * 8.0 - uTime * .6) * .015 + sin(uTime * .7) * .025;
    float swellB = coast - .18 + sin(p.y * 6.0 + uTime * .4) * .02 + sin(uTime * .55 + 1.4) * .028;
    float waves = (exp(-abs(swellA) * 240.0) * .42 + exp(-abs(swellB) * 260.0) * .28) * water;
    color=mix(color,vec3(.87,.94,.9),clamp(foam + wash + waves, 0.0, .85));
    gl_FragColor=vec4(color,1.0);
    #include <colorspace_fragment>
  }`;

function CameraFit() {
  const { size, invalidate } = useThree();
  const getScene = useThree(state => state.get);
  useEffect(() => {
    const { camera } = getScene();
    if (!(camera instanceof OrthographicCamera)) return;
    camera.zoom = Math.min(size.width / (size.width < 500 ? 10 : 11.8), size.height / 8.5);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [getScene, size.width, size.height, invalidate]);
  return null;
}

function SandPiece({ piece, texture, dark, elevation = 0 }: { piece: CastlePiece; texture: Texture; dark: boolean; elevation?: number }) {
  const color = dark ? "#bca47a" : "#dfc491";
  const material = <meshStandardMaterial color={color} map={texture} roughness={1} />;
  const flag = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 0); shape.lineTo(.56, -.16); shape.lineTo(0, -.32); shape.closePath();
    return shape;
  }, []);
  return (
    <group position={[piece.x * SPACING, 0, piece.z * SPACING]} rotation={[0, piece.rotated ? Math.PI / 2 : 0, 0]}>
      {piece.kind === "tower" && <>
        <mesh position={[0, .08, 0]} scale={[1, .12, 1]} receiveShadow>
          <sphereGeometry args={[.55, 24, 10]} />{material}
        </mesh>
        <mesh position={[0, .69, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[.35, .45, 1.3, 32]} />{material}
        </mesh>
        <mesh position={[0, 1.33, 0]} castShadow>
          <cylinderGeometry args={[.41, .37, .16, 32]} />{material}
        </mesh>
        {Array.from({ length: 7 }, (_, i) => {
          const angle = i * Math.PI * 2 / 7;
          return <mesh key={i} position={[Math.cos(angle) * .32, 1.5, Math.sin(angle) * .32]} rotation={[0, -angle, 0]} castShadow>
            <boxGeometry args={[.2, .25, .17]} />{material}
          </mesh>;
        })}
        <mesh position={[0, .87, .37]}><boxGeometry args={[.1, .23, .018]} /><meshStandardMaterial color="#756045" /></mesh>
      </>}
      {piece.kind === "wall" && <>
        <mesh position={[0, .39, 0]} castShadow receiveShadow><boxGeometry args={[1.08, .74, .36]} />{material}</mesh>
        {[-.39, 0, .39].map(x => <mesh key={x} position={[x, .84, 0]} castShadow><boxGeometry args={[.23, .22, .39]} />{material}</mesh>)}
        <mesh position={[0, .08, 0]} scale={[1.2, .1, .55]} receiveShadow><sphereGeometry args={[.55, 20, 8]} />{material}</mesh>
      </>}
      {piece.kind === "flag" && <group position={[0, elevation, 0]}>
        <mesh position={[0, .46, 0]} castShadow><cylinderGeometry args={[.025, .025, .92, 10]} /><meshStandardMaterial color="#785139" /></mesh>
        <mesh position={[.02, .9, 0]} castShadow>
          <shapeGeometry args={[flag]} /><meshStandardMaterial color="#da7960" side={DoubleSide} roughness={.85} />
        </mesh>
      </group>}
    </group>
  );
}

function Beach({ pieces, tool, cursor, dark, moving, onPlace, onAim }: Props) {
  const marker = useRef<Group>(null);
  const shader = useRef<ShaderMaterial>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const clock = useRef(0);
  const { invalidate } = useThree();
  const texture = useMemo(() => makeShellTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uDetail: { value: dark ? .018 : .035 }, uSand: { value: new Color(dark ? "#756448" : "#ddc397") }, uWater: { value: new Color(dark ? "#2e6970" : "#86bcbc") } }), [dark]);
  useEffect(() => {
    if (marker.current) { marker.current.position.set(cursor.x * SPACING, .028, cursor.z * SPACING); marker.current.visible = true; }
    invalidate();
  }, [cursor, invalidate]);
  useFrame((_, delta) => {
    if (moving && shader.current) { clock.current += Math.min(delta, .05); shader.current.uniforms.uTime.value = clock.current; }
  });
  const spot = (event: ThreeEvent<PointerEvent>) => ({ x: Math.round(event.point.x / SPACING), z: Math.round(event.point.z / SPACING) });
  const valid = ({ x, z }: { x: number; z: number }) => Math.abs(x) <= 3 && Math.abs(z) <= 2;
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.04, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <shaderMaterial ref={shader} uniforms={uniforms} vertexShader={sandVertex} fragmentShader={sandFragment} toneMapped={false} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.025, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} /><shadowMaterial opacity={dark ? .22 : .16} transparent />
    </mesh>
    {pieces.map(piece => <SandPiece key={piece.id} piece={piece} texture={texture} dark={dark}
      elevation={piece.kind === "flag" ? (pieces.find(p => p.x === piece.x && p.z === piece.z && p.kind !== "flag")?.kind === "tower" ? 1.4 : pieces.some(p => p.x === piece.x && p.z === piece.z && p.kind === "wall") ? .85 : 0) : 0} />)}
    <group position={[-2.2, 0, 1.5]} scale={.65}><Bucket /></group>
    <group ref={marker}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.43, .47, 48]} /><meshBasicMaterial color={tool === "erase" ? "#ed9c84" : "#fff4d9"} transparent opacity={.85} depthWrite={false} /></mesh>
    </group>
    {/* An invisible ground plane handles taps consistently through every piece. */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .01, 0]}
      onPointerDown={event => { press.current = { x: event.clientX, y: event.clientY }; }}
      onPointerMove={event => {
        const point = spot(event);
        if (valid(point)) onAim(point);
        if (marker.current) { marker.current.visible = valid(point); marker.current.position.set(point.x * SPACING, .028, point.z * SPACING); invalidate(); }
      }}
      onPointerLeave={() => { press.current = null; if (marker.current) marker.current.visible = false; invalidate(); }}
      onPointerUp={event => {
        if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) < 10) {
          const point = spot(event); if (valid(point)) onPlace(point.x, point.z);
        }
        press.current = null;
      }}>
      <planeGeometry args={[7.35, 5.25]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  </>;
}

export default function SandcastleScene(props: Props) {
  return <Canvas shadows orthographic camera={{ position: [7, 9, 11], zoom: 60, near: .1, far: 60 }}
    dpr={[1, 1.5]} frameloop={props.moving ? "always" : "demand"}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    style={{ touchAction: "pan-y" }} fallback={<p>The 3D beach needs WebGL enabled in your browser.</p>}>
    <CameraFit />
    <ambientLight intensity={props.dark ? 1.3 : 1.7} />
    <directionalLight position={[-4, 9, 5]} intensity={2.3} color="#fff1d6" castShadow shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={.04} />
    <Beach {...props} />
  </Canvas>;
}
