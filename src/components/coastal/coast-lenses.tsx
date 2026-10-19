"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera } from "three";
import { cameraRig } from "./camera-rig-store";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export type CoastLens = "regular" | "fisheye" | "telephoto";
const fieldOfView: Record<CoastLens, number> = { regular: 48, fisheye: 105, telephoto: 25 };

const fisheyeShader = {
  name: "CoastFisheye",
  uniforms: { tDiffuse: { value: null }, uAspect: { value: 1 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uAspect;
    varying vec2 vUv;
    void main() {
      // Equidistant-style radial projection of the wide perspective render.
      // Aspect correction makes curvature stable through window resizing.
      // The diagonal maps onto the source diagonal, keeping the full frame filled.
      vec2 p = vUv * 2. - 1.;
      float radius = length(p * vec2(uAspect, 1.)) / length(vec2(uAspect, 1.));
      float angle = 1.05;
      float scale = radius < .0001 ? angle / tan(angle)
        : tan(radius * angle) / (radius * tan(angle));
      vec2 sourceUv = .5 + p * .5 * scale;
      gl_FragColor = texture2D(tDiffuse, sourceUv);
    }
  `,
};

/** Owns rendering only in the standalone viewer; the normal lens uses no buffers. */
export function CoastLenses({ lens }: { lens: CoastLens }) {
  const getScene = useThree(state => state.get);
  const size = useThree(state => state.size);
  const dpr = useThree(state => state.viewport.dpr);
  const pipeline = useRef<{ composer: EffectComposer; warp: ShaderPass; render: RenderPass } | null>(null);

  useEffect(() => {
    const { camera, gl, scene, size, invalidate } = getScene();
    if (camera instanceof PerspectiveCamera) {
      camera.fov = fieldOfView[lens];
      camera.updateProjectionMatrix();
    }
    if (lens !== "fisheye") { invalidate(); return; }
    const composer = new EffectComposer(gl);
    composer.renderTarget1.samples = 2;
    composer.renderTarget2.samples = 2;
    const render = new RenderPass(scene, camera);
    const warp = new ShaderPass(fisheyeShader);
    const output = new OutputPass();
    warp.uniforms.uAspect.value = size.width / size.height;
    composer.addPass(render);
    composer.addPass(warp);
    composer.addPass(output);
    pipeline.current = { composer, warp, render };
    invalidate();
    return () => {
      pipeline.current = null;
      render.dispose(); warp.dispose(); output.dispose(); composer.dispose();
    };
  }, [getScene, lens]);

  useEffect(() => {
    const current = pipeline.current;
    if (!current) return;
    current.composer.setPixelRatio(dpr);
    current.composer.setSize(size.width, size.height);
    current.warp.uniforms.uAspect.value = size.width / size.height;
    getScene().invalidate();
  }, [getScene, size.width, size.height, dpr]);

  useFrame(({ gl, scene, camera }, delta) => {
    // While someone looks through the shot camera, the main picture comes from it.
    const view = cameraRig.povCamera ?? camera;
    if (pipeline.current) { pipeline.current.render.camera = view; pipeline.current.composer.render(delta); }
    else gl.render(scene, view);
  }, 1);
  return null;
}
