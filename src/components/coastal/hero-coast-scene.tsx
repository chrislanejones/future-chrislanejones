"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Color, DoubleSide, PerspectiveCamera, ShadowMaterial, UniformsLib, UniformsUtils, Vector3, type ShaderMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { makeCoastalTown } from "./hero-coast-model";
import { makeCoastTerrain } from "./coast-terrain";
import { CoastAtmosphere, getCoastLighting, type CoastWeather } from "./coast-atmosphere";
import { oceanClock } from "./ocean-clock";

type Props = { explore?: boolean; timeOfDay?: number; weather?: CoastWeather; moving: boolean; dark: boolean; onReady: () => void; onUnavailable: () => void };

// Sand relief is baked into shared geometry; only the sea moves in the shader.
const displacement = /* glsl */ `
  float shore = 16.0 + sin(p.z * .07) * .55;
  float sea = smoothstep(shore, shore + 5.0, p.x);
  p.y += sea * (.055 * sin(p.x * .85 + p.z * .13 - uTime * .6283185)
    + .025 * sin(p.x * 1.6 - p.z * .35 - uTime * .4));
`;
const vertex = /* glsl */ `
  uniform float uTime;
  attribute float duneCover;
  varying vec3 vWorld;
  varying vec3 vTerrainNormal;
  varying float vDuneCover;
  #include <fog_pars_vertex>
  void main() {
    vec3 p = position;
    ${displacement}
    vWorld = p;
    vTerrainNormal = normal;
    vDuneCover = duneCover;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;
const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSand;
  uniform vec3 uLand;
  uniform vec3 uWet;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform vec3 uFoam;
  uniform vec3 uSunDirection;
  uniform vec3 uTerrainTint;
  uniform float uTerrainBrightness;
  varying vec3 vWorld;
  varying vec3 vTerrainNormal;
  varying float vDuneCover;
  #include <fog_pars_fragment>
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
  }
  void main() {
    vec2 p=vWorld.xz;
    float grain=noise(p*65.0)-.5;
    float shore=16.0+sin(p.y*.07)*.55;
    float d=p.x-shore;
    float tide=sin(uTime*.6283185+p.y*.06)*.16;
    float irregular=noise(vec2(p.y*1.1,d*2.0))*.12;
    float edge=d+tide+irregular;
    vec3 sand=uSand+(noise(p*1.9)-.5)*.024+grain*.023;
    float grass=1.0-smoothstep(4.8,6.0+noise(p*.6)*.45,p.x);
    vec3 land=uLand+(noise(p*.7)-.5)*.045;
    vec3 color=mix(sand,land,grass);
    vec3 dunePlants=mix(uLand*.62,uLand*.85,noise(p*3.1));
    color=mix(color,dunePlants,vDuneCover*.86);
    float daylight=1.+.35*(dot(normalize(vTerrainNormal),uSunDirection)-uSunDirection.y);
    color*=daylight;
    color=mix(color,uWet,smoothstep(-1.9,.15,edge)*.75);
    float water=smoothstep(-.06,.15,edge);
    vec3 ocean=mix(uShallow,uDeep,smoothstep(0.,22.,d));
    // Stretched, irregular highlights avoid a repeating checkerboard on the water.
    float ripples=noise(vec2(d*3.8-uTime*.35,p.y*.85)+noise(p*.45)*2.0);
    ocean+=(ripples-.5)*.018;
    float shimmer=smoothstep(.73,.94,ripples)*.018;
    color=mix(color,ocean+shimmer,water);
    // Broken surf rolls toward shore every ten seconds, dissolving into the wash.
    float front=mod(d*.85+uTime*.6283185+noise(vec2(p.y*.28,0.))*.4,6.2831853);
    float crest=exp(-pow((front-.35)/.13,2.0));
    float breakup=.35+.65*noise(vec2(p.y*2.7,d*5.));
    float foam=crest*breakup*water*(1.0-smoothstep(1.,9.,d))*.64;
    float wash=exp(-abs(edge)*8.)*(.3+noise(p*5.)*.4);
    color=mix(color,uFoam,clamp(foam+wash,0.,.8));
    color*=uTerrainTint*uTerrainBrightness;
    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

function CameraComposition() {
  const { size, invalidate } = useThree();
  const getScene = useThree(state => state.get);
  useEffect(() => {
    const { camera } = getScene();
    if (!(camera instanceof PerspectiveCamera)) return;
    const mobile = size.width < 600;
    // 57 degrees from vertical: lower and more oblique than the map reference.
    // Mobile crops toward the beach, rather than stretching the whole scene.
    const targetX = mobile ? 4 : -1;
    camera.position.set(targetX + 9, 30, 48);
    camera.fov = mobile ? 48 : 37;
    camera.lookAt(targetX, 0, -3);
    camera.updateProjectionMatrix();
    invalidate();
  }, [getScene, size.width, size.height, invalidate]);
  return null;
}

function ExplorerCamera() {
  const getScene = useThree(state => state.get);
  useEffect(() => {
    const { camera, gl, invalidate } = getScene();
    camera.position.set(-12, 65, 87);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = 48;
      camera.far = 600;
      camera.updateProjectionMatrix();
    }
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(-23, 0, -30);
    controls.minDistance = 5;
    controls.maxDistance = 230;
    controls.maxPolarAngle = Math.PI * .47;
    controls.screenSpacePanning = false;
    controls.enableDamping = false;
    const onChange = () => invalidate();
    controls.addEventListener("change", onChange);
    controls.update();
    invalidate();
    return () => { controls.removeEventListener("change", onChange); controls.dispose(); };
  }, [getScene]);
  return null;
}

function Coast({ moving, dark, explore, timeOfDay = 17.5, weather = "scattered" }: Pick<Props, "moving" | "dark" | "explore" | "timeOfDay" | "weather">) {
  const material = useRef<ShaderMaterial>(null);
  const elapsed = useRef(oceanClock.elapsed);
  const town = useMemo(() => makeCoastalTown(), []);
  const lighting = useMemo(() => explore ? getCoastLighting(timeOfDay, weather) : null, [explore, timeOfDay, weather]);
  useEffect(() => () => Object.values(town).forEach(g => g.dispose()), [town]);
  const uniforms = useMemo(() => UniformsUtils.merge([UniformsLib.fog, {
    uTime: { value: 0 },
    uSand: { value: new Color(dark ? "#786d57" : "#e9ddc2") },
    uLand: { value: new Color(dark ? "#4d5a4c" : "#a6ac8d") },
    uWet: { value: new Color(dark ? "#5b716b" : "#b7bba3") },
    uShallow: { value: new Color(dark ? "#326975" : "#78acae") },
    uDeep: { value: new Color(dark ? "#173f51" : "#365f73") },
    uFoam: { value: new Color(dark ? "#a6c4bd" : "#e8eee2") },
    uSunDirection: { value: lighting ? new Vector3(...lighting.sunDirection) : new Vector3(-25, 45, 18).normalize() },
    uTerrainTint: { value: new Color(lighting?.terrainTint ?? "#ffffff") },
    uTerrainBrightness: { value: lighting?.terrainBrightness ?? 1 },
  }]), [dark, lighting]);
  useFrame((_, delta) => {
    if (!moving || !material.current) return;
    elapsed.current += Math.min(delta, .1);
    material.current.uniforms.uTime.value = elapsed.current;
  });
  return <>
    <Terrain materialRef={material} uniforms={uniforms} dark={dark} shadowOpacity={lighting?.shadowOpacity} />
    {Object.entries(town).map(([name, geometry]) => <mesh key={name} geometry={geometry} castShadow={name !== "ground" && name !== "water"} receiveShadow>
      <meshStandardMaterial vertexColors roughness={name === "water" ? .35 : .94}
        color={dark ? "#a4b8bd" : "#ffffff"} side={name === "foliage" ? DoubleSide : undefined}
        metalness={name === "glass" ? .12 : 0} />
    </mesh>)}
  </>;
}

function Terrain({ materialRef, uniforms, dark, shadowOpacity }: {
  materialRef: RefObject<ShaderMaterial | null>;
  uniforms: Record<string, { value: number | Color | Vector3 }>;
  dark: boolean;
  shadowOpacity?: number;
}) {
  const geometry = useMemo(() => makeCoastTerrain(), []);
  const shadow = useMemo(() => {
    const receiver = new ShadowMaterial({ opacity: shadowOpacity ?? (dark ? .32 : .28), depthWrite: false });
    receiver.onBeforeCompile = shader => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader = `uniform float uTime; varying float vShoreShadow;\n${shader.vertexShader}`.replace(
        "#include <begin_vertex>",
        `vec3 p = position; ${displacement} vShoreShadow = 1. - smoothstep(15., 20., p.x); vec3 transformed = p + vec3(0., .004, 0.);`,
      );
      shader.fragmentShader = `varying float vShoreShadow;\n${shader.fragmentShader}`.replace(
        "#include <tonemapping_fragment>",
        "gl_FragColor.a *= vShoreShadow;\n#include <tonemapping_fragment>",
      );
    };
    return receiver;
  }, [dark, shadowOpacity, uniforms]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => shadow.dispose(), [shadow]);
  useEffect(() => {
    const shader = materialRef.current;
    return () => shader?.dispose();
  }, [materialRef]);
  return <group dispose={null}>
    <mesh geometry={geometry}>
      <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={vertex}
        fragmentShader={fragment} fog />
    </mesh>
    <mesh geometry={geometry} material={shadow} receiveShadow />
  </group>;
}

function SceneLifecycle({ onReady, onUnavailable, moving }: Pick<Props, "onReady" | "onUnavailable" | "moving">) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    if (!moving) return;
    const interval = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(interval);
  }, [moving, invalidate]);
  const ready = useRef(false);
  useFrame(() => { if (!ready.current) { ready.current = true; onReady(); } });
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = () => onUnavailable();
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onUnavailable]);
  return null;
}

export default function HeroCoastScene(props: Props) {
  const sky = props.dark ? "#415c61" : "#d9e2d6";
  return <Canvas shadows="percentage" camera={{ position: [8,30,48], fov:37, near:.1, far:350 }}
    dpr={props.explore ? [1,2] : [1,1.5]} frameloop="demand"
    gl={{ alpha:false, antialias:true, powerPreference:props.explore ? "high-performance" : "low-power" }} fallback={null}>
    {props.explore ? <CoastAtmosphere timeOfDay={props.timeOfDay ?? 17.5} weather={props.weather ?? "scattered"} /> : <>
    <color attach="background" args={[sky]} />
    <fog attach="fog" args={[sky,85,180]} />
    <hemisphereLight args={["#dcecf2", "#bba57c", props.dark ? 1 : 1.35]} />
    <directionalLight position={[-25,45,18]} intensity={props.dark ? 1.5 : 2.3} color={props.dark ? "#cee8ef" : "#fff1d8"}
      castShadow shadow-mapSize={props.explore ? [4096,4096] : [2048,2048]} shadow-camera-left={props.explore ? -120 : -45} shadow-camera-right={props.explore ? 80 : 45}
      shadow-camera-top={110} shadow-camera-bottom={-75} shadow-camera-far={230} shadow-normalBias={.025}
      shadow-autoUpdate={false} shadow-needsUpdate />
    </>}
    {props.explore ? <ExplorerCamera /> : <CameraComposition />}
    <Coast moving={props.moving} dark={props.dark} explore={props.explore} timeOfDay={props.timeOfDay} weather={props.weather} />
    <SceneLifecycle moving={props.moving} onReady={props.onReady} onUnavailable={props.onUnavailable} />
  </Canvas>;
}
