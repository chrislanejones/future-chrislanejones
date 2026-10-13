"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, OrthographicCamera, Shape, type BufferGeometry, type Group, type ShaderMaterial, type Texture } from "three";
import { Bucket } from "./beach-castle-scene";
import { makeShellGeometries, makeShellTexture, type ShellKind } from "./shell-geometry";
import { pieceElevation, type CastlePiece, type CastleTool } from "./sandcastle-model";

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
    // Soft value noise: gentle mottling instead of per-pixel grain, which aliased into stripes.
    vec2 cell = vUv * 260.0; vec2 i = floor(cell); vec2 f = fract(cell); f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float noise = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    vec3 sand = uSand + (noise - .5) * uDetail;
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

const SHELL_KINDS: ShellKind[] = ["scallop", "clam", "spiral"];
type Shells = Record<ShellKind, BufferGeometry>;

type Links = { n: boolean; e: boolean; s: boolean; w: boolean };
const HALF = SPACING / 2;

function SandPiece({ piece, texture, shells, dark, elevation = 0, links }: { piece: CastlePiece; texture: Texture; shells: Shells; dark: boolean; elevation?: number; links?: Links }) {
  const color = dark ? "#bca47a" : "#dfc491";
  const material = <meshStandardMaterial color={color} map={texture} roughness={1} />;
  const flag = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 0); shape.lineTo(.56, -.16); shape.lineTo(0, -.32); shape.closePath();
    return shape;
  }, []);
  const stacked = piece.level > 0;
  // Each story narrows a little so the stack reads as sand pressed on sand.
  const taper = piece.level === 2 ? .68 : .82;
  return (
    <group position={[piece.x * SPACING, 0, piece.z * SPACING]} rotation={[0, piece.kind === "wall" && piece.rotated ? Math.PI / 2 : 0, 0]}>
      {piece.kind === "tower" && <group position={[0, elevation, 0]} scale={stacked ? [taper, 1, taper] : 1}>
        {!stacked && <mesh position={[0, .08, 0]} scale={[1, .12, 1]} receiveShadow>
          <sphereGeometry args={[.55, 24, 10]} />{material}
        </mesh>}
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
      </group>}
      {piece.kind === "bucket" && <group position={[0, elevation, 0]} scale={stacked ? [taper, 1, taper] : 1}>
        {/* A bucket mold: wider at the base, with the ridges of the bucket pressed into the sand. */}
        {!stacked && <mesh position={[0, .07, 0]} scale={[1.1, .11, 1.1]} receiveShadow>
          <sphereGeometry args={[.55, 24, 10]} />{material}
        </mesh>}
        <mesh position={[0, .5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[.4, .5, 1, 40]} />{material}
        </mesh>
        {[.22, .5, .78].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[.5 - y * .1, .028, 8, 40]} />{material}
        </mesh>)}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[.36, .4, .05, 40]} />{material}
        </mesh>
        <mesh position={[.12, 1.03, -.08]} scale={[1, .5, 1]}>
          <sphereGeometry args={[.09, 12, 8]} />{material}
        </mesh>
      </group>}
      {piece.kind === "moat" && (links && Object.values(links).some(Boolean) ? <>
        {/* Linked moats run to the tile edge, so neighbors join into lines, corners, and rings. */}
        {[{ on: links.n, pos: [0, -HALF / 2] as const, len: HALF, turn: 0 },
          { on: links.s, pos: [0, HALF / 2] as const, len: HALF, turn: Math.PI },
          { on: links.e, pos: [HALF / 2, 0] as const, len: HALF, turn: Math.PI / 2 },
          { on: links.w, pos: [-HALF / 2, 0] as const, len: HALF, turn: -Math.PI / 2 },
          { on: true, pos: [0, 0] as const, len: .5, turn: 0 }].filter(part => part.on).map((part, i) => <group key={i} position={[part.pos[0], 0, part.pos[1]]} rotation={[0, part.turn, 0]}>
          <mesh position={[0, .004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[.68, part.len + .18]} />
            <meshStandardMaterial color={dark ? "#5c4e3b" : "#bfa171"} map={texture} roughness={1} />
          </mesh>
          <mesh position={[0, .008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[.5, part.len + .02]} />
            <meshStandardMaterial color={dark ? "#3f8a90" : "#79b8b8"} roughness={.3} metalness={.1} />
          </mesh>
          <mesh position={[0, .011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[.3, part.len]} />
            <meshBasicMaterial color={dark ? "#58a3a8" : "#9dd0ce"} transparent opacity={.55} depthWrite={false} />
          </mesh>
        </group>)}
      </> : <>
        <mesh position={[0, .005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[.2, .52, 48]} />
          <meshStandardMaterial color={dark ? "#4a9aa0" : "#86c2c2"} roughness={.3} metalness={.1} />
        </mesh>
        <mesh position={[0, .012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[.44, .48, 48]} />
          <meshBasicMaterial color="#e4f2ef" transparent opacity={.5} depthWrite={false} />
        </mesh>
        <mesh position={[0, .03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[.54, .06, 8, 48]} />
          <meshStandardMaterial color={dark ? "#8f7a58" : "#c9ad7a"} map={texture} roughness={1} />
        </mesh>
        <mesh position={[0, .04, 0]} scale={[1, .35, 1]} castShadow receiveShadow>
          <sphereGeometry args={[.2, 20, 10]} />{material}
        </mesh>
      </>)}
      {piece.kind === "shell" && <group position={[.14, elevation + .02, .1]} rotation={[-Math.PI / 2, 0, (piece.id * 1.7) % (Math.PI * 2)]} scale={.3}>
        <mesh geometry={shells[SHELL_KINDS[piece.id % 3]]} castShadow>
          <meshStandardMaterial color={piece.id % 2 ? "#f4e4cf" : "#e9c9b6"} map={texture} roughness={.75} />
        </mesh>
      </group>}
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

/** Which side-by-side tiles also hold a moat. Diagonals don't join: around a castle they drew an X through the middle. */
function moatLinks(moats: Set<string>, x: number, z: number): Links {
  const at = (dx: number, dz: number) => moats.has(`${x + dx},${z + dz}`);
  return { n: at(0, -1), s: at(0, 1), e: at(1, 0), w: at(-1, 0) };
}

/** The buildable patch: packed sand with a ragged, hand-smoothed edge around the 7x5 grid. */
function makePatch() {
  const w = 3.3 * SPACING + .55, h = 2.3 * SPACING + .55, steps = 64;
  const noise = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
  const shape = new Shape();
  for (let i = 0; i < steps; i++) {
    const t = i / steps, edge = (t * 4) % 1, side = Math.floor(t * 4);
    const wobble = (noise(i) - .5) * .34 + Math.sin(i * 1.7) * .06;
    let x = 0, y = 0;
    if (side === 0) { x = -w + edge * 2 * w; y = h + wobble; }
    else if (side === 1) { x = w + wobble; y = h - edge * 2 * h; }
    else if (side === 2) { x = w - edge * 2 * w; y = -h + wobble; }
    else { x = -w + wobble; y = -h + edge * 2 * h; }
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function Beach({ pieces, tool, cursor, dark, moving, onPlace, onAim }: Props) {
  const patch = useMemo(() => makePatch(), []);
  const marker = useRef<Group>(null);
  const shader = useRef<ShaderMaterial>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const clock = useRef(0);
  const { invalidate } = useThree();
  const moats = useMemo(() => new Set(pieces.filter(p => p.kind === "moat").map(p => `${p.x},${p.z}`)), [pieces]);
  const texture = useMemo(() => makeShellTexture(), []);
  const shells = useMemo(() => makeShellGeometries(), []);
  useEffect(() => () => { texture.dispose(); Object.values(shells).forEach(geometry => geometry.dispose()); }, [texture, shells]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uDetail: { value: dark ? .02 : .03 }, uSand: { value: new Color(dark ? "#756448" : "#ddc397") }, uWater: { value: new Color(dark ? "#2e6970" : "#86bcbc") } }), [dark]);
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
    {/* A lighter, slightly larger copy underneath reads as the raked rim of the packed patch. */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.034, 0]} scale={[1.035, 1.05, 1]} receiveShadow>
      <shapeGeometry args={[patch]} />
      <meshStandardMaterial color={dark ? "#7b6a4b" : "#e3cb9f"} roughness={1} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.032, 0]} receiveShadow>
      <shapeGeometry args={[patch]} />
      <meshStandardMaterial color={dark ? "#6c5c41" : "#d4b886"} roughness={1} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.025, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} /><shadowMaterial opacity={dark ? .22 : .16} transparent />
    </mesh>
    {pieces.map(piece => <SandPiece key={piece.id} piece={piece} texture={texture} shells={shells} dark={dark} elevation={pieceElevation(pieces, piece)}
      links={piece.kind === "moat" ? moatLinks(moats, piece.x, piece.z) : undefined} />)}
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
