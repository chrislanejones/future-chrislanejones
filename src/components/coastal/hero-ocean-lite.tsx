"use client";

import { useEffect, useRef, useState } from "react";
import { oceanClock } from "./ocean-clock";

/*
 * The sea from the hero coast, drawn on its own over the still while the full
 * 3D town loads (on phones it is the whole show; the 3D never loads there). Plain WebGL and one full-screen triangle, no three.js, so the
 * water moves within a moment of hydration. Each pixel casts a ray from the hero
 * camera to the ground plane and runs the same sand and surf math as the
 * terrain shader in hero-coast-scene.tsx; keep the two in step. Land pixels are
 * transparent, so the still's houses and dunes show through untouched.
 */

const vertex = `
  attribute vec2 aPosition;
  varying vec2 vNdc;
  void main() { vNdc = aPosition; gl_Position = vec4(aPosition, 0., 1.); }
`;
const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uCamera, uForward, uRight, uUp;
  uniform vec2 uLens, uScale, uOffset;
  uniform vec3 uSand, uWet, uShallow, uDeep, uFoam, uFog;
  uniform vec2 uFogRange;
  varying vec2 vNdc;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
  }
  vec3 aces(vec3 color) {
    const mat3 inputMat = mat3(vec3(.59719,.07600,.02840), vec3(.35458,.90834,.13383), vec3(.04823,.01566,.83777));
    const mat3 outputMat = mat3(vec3(1.60475,-.10208,-.00327), vec3(-.53108,1.10813,-.07276), vec3(-.07367,-.00605,1.07602));
    color = inputMat * (color / .6);
    color = (color * (color + .0245786) - .000090537) / (color * (.983729 * color + .4329510) + .238081);
    return clamp(outputMat * color, 0., 1.);
  }
  vec3 srgb(vec3 c) {
    return mix(pow(c, vec3(.41666)) * 1.055 - .055, c * 12.92, vec3(lessThanEqual(c, vec3(.0031308))));
  }
  void main() {
    vec2 ndc = vNdc * uScale + uOffset;
    vec3 ray = uForward + ndc.x * uLens.x * uRight + ndc.y * uLens.y * uUp;
    if (ray.y >= 0.) discard;
    float depth = -uCamera.y / ray.y;
    vec2 p = (uCamera + ray * depth).xz;
    // The pier (z = -94) stands over the surf; leave it and the water it hides to the still.
    if (p.y > -103. && p.y < -92.5 && p.x < 36.) discard;
    float grain=noise(p*65.0)-.5;
    float shore=16.0+sin(p.y*.07)*.55;
    float d=p.x-shore;
    float tide=sin(uTime*.6283185+p.y*.06)*.16;
    float irregular=noise(vec2(p.y*1.1,d*2.0))*.12;
    float edge=d+tide+irregular;
    float cover=smoothstep(-.3,-.08,edge);
    if (cover <= 0.) discard;
    vec3 color=uSand+(noise(p*1.9)-.5)*.024+grain*.023;
    color=mix(color,uWet,smoothstep(-1.9,.15,edge)*.75);
    float water=smoothstep(-.06,.15,edge);
    vec3 ocean=mix(uShallow,uDeep,smoothstep(0.,22.,d));
    float ripples=noise(vec2(d*3.8-uTime*.35,p.y*.85)+noise(p*.45)*2.0);
    ocean+=(ripples-.5)*.018;
    float shimmer=smoothstep(.73,.94,ripples)*.018;
    color=mix(color,ocean+shimmer,water);
    float front=mod(d*.85+uTime*.6283185+noise(vec2(p.y*.28,0.))*.4,6.2831853);
    float crest=exp(-pow((front-.35)/.13,2.0));
    float breakup=.35+.65*noise(vec2(p.y*2.7,d*5.));
    float foam=crest*breakup*water*(1.0-smoothstep(1.,9.,d))*.64;
    float wash=exp(-abs(edge)*8.)*(.3+noise(p*5.)*.4);
    color=mix(color,uFoam,clamp(foam+wash,0.,.8));
    color=srgb(aces(color));
    color=mix(color,uFog,smoothstep(uFogRange.x,uFogRange.y,depth));
    gl_FragColor=vec4(color*cover,cover);
  }
`;

// three.js stores hex colors as linear values; the sea shader works in linear too.
function linear(hex: string) {
  return [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
  });
}
const PALETTE = {
  light: { sand:"#e9ddc2", wet:"#b7bba3", shallow:"#78acae", deep:"#365f73", foam:"#e8eee2", fog:"#d9e2d6" },
  dark: { sand:"#786d57", wet:"#5b716b", shallow:"#326975", deep:"#173f51", foam:"#a6c4bd", fog:"#415c61" },
};
type Vec3 = [number, number, number];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const unit = (a: Vec3): Vec3 => { const l = Math.hypot(...a); return [a[0]/l, a[1]/l, a[2]/l]; };

// Size of public/hero/coast-*.webp, captured from the 3D at the desktop camera.
const STILL = { width:1400, height:680 };

type Scene = { gl: WebGLRenderingContext; at: (name: string) => WebGLUniformLocation | null };

export function HeroOceanLite({ moving, dark, className }: { moving: boolean; dark: boolean; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);

  // One context for the life of the layer; theme and motion changes reuse it.
  useEffect(() => {
    const element = canvas.current;
    const gl = element?.getContext("webgl", { alpha:true, premultipliedAlpha:true, antialias:false, powerPreference:"low-power" });
    if (!element || !gl) return;
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const at = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform2f(at("uFogRange"), 85, 180);

    // The desktop camera from CameraComposition in hero-coast-scene.tsx, framed
    // like the still: same 1400x680 shot, same object-fit cover and position,
    // so the sea lands on the still's sea at any hero size, phones included.
    const eye: Vec3 = [8, 30, 48];
    const forward = unit(sub([-1, 0, -3], eye));
    const right = unit(cross(forward, [0, 1, 0]));
    const lens = Math.tan(37 * Math.PI / 360);
    gl.uniform3fv(at("uCamera"), eye);
    gl.uniform3fv(at("uForward"), forward);
    gl.uniform3fv(at("uRight"), right);
    gl.uniform3fv(at("uUp"), cross(right, forward));
    gl.uniform2f(at("uLens"), lens * STILL.width / STILL.height, lens);
    const frame = () => {
      const width = element.clientWidth, height = element.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(devicePixelRatio, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      gl.viewport(0, 0, element.width, element.height);
      const poster = element.parentElement?.querySelector("img");
      const [px, py] = (poster ? getComputedStyle(poster).objectPosition : "50% 50%")
        .split(" ").map(value => parseFloat(value) / 100);
      const cover = Math.max(width / STILL.width, height / STILL.height);
      const shownWidth = STILL.width * cover, shownHeight = STILL.height * cover;
      const left = (width - shownWidth) * (Number.isFinite(px) ? px : .5);
      const top = (height - shownHeight) * (Number.isFinite(py) ? py : .5);
      gl.uniform2f(at("uScale"), width / shownWidth, height / shownHeight);
      gl.uniform2f(at("uOffset"), (width - 2 * left) / shownWidth - 1, 1 - height / shownHeight + 2 * top / shownHeight);
    };
    frame();
    const resize = new ResizeObserver(frame);
    resize.observe(element);
    setScene({ gl, at });
    return () => {
      resize.disconnect();
      setScene(null);
      // No loseContext(): React may remount on the same canvas, and a lost
      // context never comes back. The browser frees it with the canvas.
    };
  }, []);

  useEffect(() => {
    if (!scene) return;
    const { gl, at } = scene;
    for (const [name, hex] of Object.entries(PALETTE[dark ? "dark" : "light"])) {
      // Fog blends after the sRGB step in three.js, still with the linear color.
      gl.uniform3fv(at(`u${name[0].toUpperCase()}${name.slice(1)}`), linear(hex));
    }
    const time = at("uTime");
    let raf = 0, last = performance.now(), drawn = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // 30 fps, like the full scene.
      if (now - drawn < 1000 / 30 - 2) return;
      if (moving) oceanClock.elapsed += Math.min((now - last) / 1000, .1);
      last = now; drawn = now;
      gl.uniform1f(time, oceanClock.elapsed);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!moving) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [scene, moving, dark]);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
