"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Color, DoubleSide, PerspectiveCamera, PlaneGeometry, ShadowMaterial, UniformsLib, UniformsUtils, type ShaderMaterial } from "three";
import { makeCoastalTown } from "./hero-coast-model";

type Props = { moving: boolean; dark: boolean; onReady: () => void; onUnavailable: () => void };

// Shared by the colored terrain and its shadow receiver, including dune elevation.
const displacement = /* glsl */ `
  float shore = 16.0 + sin(p.z * .07) * .55;
  float sea = smoothstep(shore, shore + 5.0, p.x);
  float dunes = exp(-pow((p.x - 7.6) / 1.9, 2.0));
  p.y += dunes * (.22 + .15 * sin(p.z * .47) * sin(p.z * .19));
  p.y += sea * (.055 * sin(p.x * .85 + p.z * .13 - uTime * .6283185)
    + .025 * sin(p.x * 1.6 - p.z * .35 - uTime * .4));
`;
const vertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vec3 p = position;
    ${displacement}
    vWorld = p;
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
  varying vec3 vWorld;
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
    float grass=1.0-smoothstep(4.8,7.5+noise(p*.6),p.x);
    vec3 land=uLand+(noise(p*.7)-.5)*.045;
    vec3 color=mix(sand,land,grass);
    float scrub=exp(-pow((p.x-7.4)/1.35,2.0))*smoothstep(.46,.64,noise(p*2.));
    color=mix(color,uLand*.83,scrub*.7);
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

function Coast({ moving, dark }: Pick<Props, "moving" | "dark">) {
  const material = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const town = useMemo(() => makeCoastalTown(), []);
  useEffect(() => () => Object.values(town).forEach(g => g.dispose()), [town]);
  const uniforms = useMemo(() => UniformsUtils.merge([UniformsLib.fog, {
    uTime: { value: 0 },
    uSand: { value: new Color(dark ? "#786d57" : "#e9ddc2") },
    uLand: { value: new Color(dark ? "#4d5a4c" : "#a6ac8d") },
    uWet: { value: new Color(dark ? "#5b716b" : "#b7bba3") },
    uShallow: { value: new Color(dark ? "#326975" : "#78acae") },
    uDeep: { value: new Color(dark ? "#173f51" : "#365f73") },
    uFoam: { value: new Color(dark ? "#a6c4bd" : "#e8eee2") },
  }]), [dark]);
  useFrame((_, delta) => {
    if (!moving || !material.current) return;
    elapsed.current += Math.min(delta, .1);
    material.current.uniforms.uTime.value = elapsed.current;
  });
  return <>
    <Terrain materialRef={material} uniforms={uniforms} dark={dark} />
    {Object.entries(town).map(([name, geometry]) => <mesh key={name} geometry={geometry} castShadow={name !== "ground" && name !== "water"} receiveShadow>
      <meshStandardMaterial vertexColors roughness={name === "water" ? .35 : .94}
        color={dark ? "#a4b8bd" : "#ffffff"} side={name === "foliage" ? DoubleSide : undefined}
        metalness={name === "glass" ? .12 : 0} />
    </mesh>)}
  </>;
}

function Terrain({ materialRef, uniforms, dark }: {
  materialRef: RefObject<ShaderMaterial | null>;
  uniforms: Record<string, { value: number | Color }>;
  dark: boolean;
}) {
  const geometry = useMemo(() => new PlaneGeometry(300, 360, 180, 220).rotateX(-Math.PI / 2), []);
  const shadow = useMemo(() => {
    const receiver = new ShadowMaterial({ opacity: dark ? .32 : .28, depthWrite: false });
    receiver.onBeforeCompile = shader => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace(
        "#include <begin_vertex>",
        `vec3 p = position; ${displacement} vec3 transformed = p + vec3(0., .004, 0.);`,
      );
    };
    return receiver;
  }, [dark, uniforms]);
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
  return <Canvas shadows camera={{ position: [8,30,48], fov:37, near:.1, far:350 }}
    dpr={[1,1.5]} frameloop="demand"
    gl={{ alpha:false, antialias:true, powerPreference:"low-power" }} fallback={null}>
    <color attach="background" args={[sky]} />
    <fog attach="fog" args={[sky,85,180]} />
    <hemisphereLight args={["#dcecf2", "#bba57c", props.dark ? 1 : 1.35]} />
    <directionalLight position={[-25,45,18]} intensity={props.dark ? 1.5 : 2.3} color={props.dark ? "#cee8ef" : "#fff1d8"}
      castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-45} shadow-camera-right={45}
      shadow-camera-top={110} shadow-camera-bottom={-75} shadow-camera-far={230} shadow-normalBias={.025}
      shadow-autoUpdate={false} shadow-needsUpdate />
    <CameraComposition />
    <Coast moving={props.moving} dark={props.dark} />
    <SceneLifecycle moving={props.moving} onReady={props.onReady} onUnavailable={props.onUnavailable} />
  </Canvas>;
}
