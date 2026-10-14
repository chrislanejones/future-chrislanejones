"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BackSide, Color, Object3D, Vector3, type DirectionalLight, type Mesh } from "three";

export type CoastWeather = "clear" | "scattered" | "overcast";

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (low: number, high: number, value: number) => {
  const t = clamp((value - low) / (high - low));
  return t * t * (3 - 2 * t);
};
const tint = (a: string, b: string, amount: number) => `#${new Color(a).lerp(new Color(b), amount).getHexString()}`;

/** Art-directed local scene hours, not a date-aware solar or weather simulation. */
export function getCoastLighting(timeOfDay: number, weather: CoastWeather) {
  const hour = clamp(Number.isFinite(timeOfDay) ? timeOfDay : 17.5, 6, 20);
  // +X is the Atlantic/east; the afternoon sun travels inland toward -X/west.
  // The requested 5:30 preset is a stylized sunset, independent of calendar date.
  const angle = hour >= 17 ? Math.PI - (.19 - (hour - 17) * .2) : (hour - 6) / 11 * (Math.PI - .19);
  const sun = new Vector3(Math.cos(angle), Math.sin(angle) * .92, .12).normalize();
  const daylight = smooth(-.2, .13, sun.y);
  const warmth = 1 - smooth(.08, .66, sun.y);
  const dusk = 1 - smooth(-.15, .13, sun.y);
  const cloudiness = weather === "overcast" ? 1 : weather === "scattered" ? .46 : .04;
  const sunStrength = weather === "overcast" ? .17 : weather === "scattered" ? .83 : 1;
  return {
    sunDirection: sun.toArray() as [number, number, number],
    sunIntensity: (1.25 + Math.max(0, sun.y) * 1.45) * daylight * sunStrength,
    sunColor: tint("#fff5e3", "#ffbb86", warmth * .87),
    skyTop: tint(tint("#739fc8", "#7c83ac", warmth * .82), "#4e527f", dusk * .72),
    skyHorizon: tint(tint("#d3dfe9", "#d9a7c2", warmth * .87), "#ad8dac", dusk * .6),
    horizonGlow: tint("#ffe4b2", "#ffae78", warmth),
    skyFill: tint("#dbe7f3", "#bfc1ed", warmth * .82),
    groundFill: tint("#aaa18e", "#928ba7", warmth * .65 + dusk * .25),
    fillIntensity: (1.2 + cloudiness * .36) * (1 - dusk * .4),
    terrainTint: tint(tint("#ffffff", "#f0deed", warmth * .42), "#b8b8e1", dusk * .7),
    terrainBrightness: (.99 - cloudiness * .06) * (1 - dusk * .3),
    shadowOpacity: (.31 - cloudiness * .24) * daylight,
    shadowIntensity: (1 - cloudiness * .82) * daylight,
    fogNear: 160 - cloudiness * 42,
    fogFar: 365 - cloudiness * 100,
    warmth,
    daylight,
    cloudiness,
  };
}

const skyVertex = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform float uClouds;
  uniform float uWarmth;
  uniform float uDaylight;
  varying vec3 vDirection;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
      mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0., weight = .52;
    mat2 turn = mat2(.8, -.6, .6, .8);
    for (int i = 0; i < 5; i++) {
      value += noise(p) * weight;
      p = turn * p * 2.03 + vec2(7.1, 3.7);
      weight *= .49;
    }
    return value;
  }
  float cloudField(vec2 p) {
    vec2 warp = vec2(noise(p * .38), noise(p * .38 + 41.7));
    return fbm(p + warp * 1.25);
  }
  void main() {
    vec3 ray = normalize(vDirection);
    float elevation = max(ray.y, 0.);
    float high = pow(elevation, .46);
    vec3 color = mix(uHorizon, uTop, high);
    float towardSun = max(0., dot(normalize(vec3(ray.x, .001, ray.z)), normalize(vec3(uSun.x, .001, uSun.z))));
    float glow = pow(towardSun, 6.) * exp(-elevation * 4.5) * uWarmth;
    color = mix(color, uGlow, glow * .66 * (1. - uClouds * .7));
    float solarDot = max(0., dot(ray, uSun));
    float halo = pow(solarDot, 70.) * .24 + pow(solarDot, 650.) * .17;
    color += uGlow * halo * uDaylight * (1. - uClouds * .86);

    // Project separate cloud layers into the dome. A fixed seed gives stable weather
    // while orbiting; no texture assets, camera-locked clouds or animated noise.
    vec2 p = ray.xz / (max(ray.y, 0.) + .24) * 2.6;
    float field = cloudField(p + vec2(8.2, -4.7));
    float threshold = mix(.79, .27, uClouds);
    float billow = smoothstep(threshold - .055, threshold + .13, field);
    float thickness = smoothstep(threshold + .025, threshold + .23, field);
    float offsetField = cloudField(p + vec2(8.2, -4.7) + uSun.xz * .16);
    float litEdge = clamp((field - offsetField) * 5.0 + .52, .1, 1.);
    vec3 cloudShade = mix(vec3(.61, .67, .76), vec3(.89, .92, .96), litEdge);
    cloudShade *= 1. - thickness * .12;
    vec3 warmEdge = mix(vec3(1., .91, .78), uGlow, .3);
    cloudShade = mix(cloudShade, warmEdge, uWarmth * (.2 + .5 * towardSun) * litEdge * (1. - uClouds * .6));
    float fringe = smoothstep(threshold - .075, threshold + .035, field) - billow;
    cloudShade += fringe * .25;
    cloudShade *= .6 + .4 * uDaylight;
    float visibleClouds = smoothstep(-.04, .035, ray.y);
    color = mix(color, cloudShade, billow * visibleClouds * .97);

    // Thin high cirrus retain blue gaps and catch peach light at the western sunset.
    vec2 wisps = vec2(p.x * .65 + p.y * .27, p.y * 3.1);
    float veil = smoothstep(.5, .78, fbm(wisps + 24.)) * .33;
    veil *= smoothstep(.05, .3, ray.y) * (1. - uClouds * .7);
    vec3 highCloud = mix(vec3(.91, .95, 1.), warmEdge, uWarmth * towardSun * .68);
    color = mix(color, highCloud * (.65 + .35 * uDaylight), veil);
    float disc = smoothstep(.99991, .99996, solarDot);
    color += uGlow * disc * 2.1 * uDaylight * (1. - billow * .98) * (1. - uClouds * .75);
    gl_FragColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function CoastAtmosphere({ timeOfDay, weather }: { timeOfDay: number; weather: CoastWeather }) {
  const light = useRef<DirectionalLight>(null);
  const dome = useRef<Mesh>(null);
  const getScene = useThree(state => state.get);
  const lighting = useMemo(() => getCoastLighting(timeOfDay, weather), [timeOfDay, weather]);
  const target = useMemo(() => {
    const object = new Object3D();
    object.position.set(-31, 0, -32);
    return object;
  }, []);
  const lightPosition = useMemo(() => new Vector3(...lighting.sunDirection).multiplyScalar(190).add(target.position), [lighting, target]);
  const uniforms = useMemo(() => ({
    uSun: { value: new Vector3(...lighting.sunDirection) },
    uTop: { value: new Color(lighting.skyTop) },
    uHorizon: { value: new Color(lighting.skyHorizon) },
    uGlow: { value: new Color(lighting.horizonGlow) },
    uClouds: { value: lighting.cloudiness },
    uWarmth: { value: lighting.warmth },
    uDaylight: { value: lighting.daylight },
  }), [lighting]);
  useEffect(() => {
    const { gl, invalidate } = getScene();
    if (light.current) light.current.shadow.needsUpdate = true;
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [lighting, getScene]);
  // The dome follows translation only, so panning never reaches its edge.
  useFrame(({ camera }) => { dome.current?.position.copy(camera.position); });
  return <>
    <color attach="background" args={[lighting.skyHorizon]} />
    <fog attach="fog" args={[lighting.skyHorizon, lighting.fogNear, lighting.fogFar]} />
    <mesh ref={dome} renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[480, 48, 24]} />
      <shaderMaterial uniforms={uniforms} vertexShader={skyVertex} fragmentShader={skyFragment}
        side={BackSide} depthWrite={false} fog={false} />
    </mesh>
    <hemisphereLight args={[lighting.skyFill, lighting.groundFill, lighting.fillIntensity]} />
    <primitive object={target} />
    <directionalLight ref={light} target={target} position={lightPosition}
      color={lighting.sunColor} intensity={lighting.sunIntensity} castShadow
      shadow-mapSize={[4096, 4096]} shadow-camera-left={-125} shadow-camera-right={125}
      shadow-camera-top={115} shadow-camera-bottom={-115} shadow-camera-near={1} shadow-camera-far={430}
      shadow-normalBias={.025} shadow-bias={-.000035} shadow-radius={2.2}
      shadow-intensity={lighting.shadowIntensity} shadow-autoUpdate={false} />
  </>;
}
