// src/components/page/wireframe-terrain.tsx
"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";

interface WireframeTerrainProps {
  variant?: "left" | "right";
}

const GRID = 40;
const HEIGHT_MULT = 0.9;
const PERSPECTIVE = 0.75;
const OPACITY = 0.22;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 440;

export default function WireframeTerrain({
  variant = "right",
}: WireframeTerrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heightMapRef = useRef<number[][]>([]);
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Dynamic rotation based on variant
  const ROTATE_DEG = variant === "left" ? 12 : -12;

  const generateTerrain = (grid: number) => {
    const hm: number[][] = new Array(grid);
    for (let y = 0; y < grid; y++) {
      hm[y] = new Array(grid);
      for (let x = 0; x < grid; x++) {
        let h = 0;
        h += Math.sin(x * 0.1) * Math.cos(y * 0.1) * 30;
        h += Math.sin(x * 0.28) * Math.cos(y * 0.22) * 15;
        h += Math.sin(x * 0.055) * Math.cos(y * 0.045) * 48;
        h += (Math.random() - 0.5) * 14;
        hm[y][x] = Math.max(0, h);
      }
    }
    heightMapRef.current = hm;
  };

  const getAccentRGB = () => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim();
    let r = 34,
      g = 197,
      b = 94;
    if (accent.startsWith("#")) {
      const hex = accent.replace("#", "");
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    return { r, g, b };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const hm = heightMapRef.current;
    if (!canvas || hm.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const theta = (ROTATE_DEG * Math.PI) / 180;

    const grid = hm.length;
    const cellX = width / (grid - 1);
    const cellY = height / (grid - 1);
    const { r, g, b } = getAccentRGB();
    ctx.lineWidth = 1;

    const cx = width / 2;
    const cy = height / 2;
    function rotate(x: number, y: number) {
      const dx = x - cx;
      const dy = y - cy;
      const rx = dx * Math.cos(theta) - dy * Math.sin(theta);
      const ry = dx * Math.sin(theta) + dy * Math.cos(theta);
      return [rx + cx, ry + cy];
    }

    if (isDesktop && hoveredCell) {
      const { x: hx, y: hy } = hoveredCell;
      if (hx >= 0 && hx < grid - 1 && hy >= 0 && hy < grid - 1) {
        ctx.beginPath();
        const corners = [
          [hx, hy],
          [hx + 1, hy],
          [hx + 1, hy + 1],
          [hx, hy + 1],
        ];
        corners.forEach(([x, y], idx) => {
          const hVal = hm[y][x] * HEIGHT_MULT;
          let sx = x * cellX;
          let sy = y * cellY - hVal * PERSPECTIVE;
          [sx, sy] = rotate(sx, sy);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
        ctx.fill();
      }
    }

    for (let y = 0; y < grid; y++) {
      ctx.beginPath();
      for (let x = 0; x < grid; x++) {
        const hVal = hm[y][x] * HEIGHT_MULT;
        let sx = x * cellX;
        let sy = y * cellY - hVal * PERSPECTIVE;
        [sx, sy] = rotate(sx, sy);
        if (x === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      const depth = y / (grid - 1);
      const alpha = OPACITY * (0.35 + depth * 0.85);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.stroke();
    }

    for (let x = 0; x < grid; x++) {
      ctx.beginPath();
      for (let y = 0; y < grid; y++) {
        const hVal = hm[y][x] * HEIGHT_MULT;
        let sx = x * cellX;
        let sy = y * cellY - hVal * PERSPECTIVE;
        [sx, sy] = rotate(sx, sy);
        if (y === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      const depth = x / (grid - 1);
      const alpha = OPACITY * (0.35 + depth * 0.85);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.stroke();
    }
  };

  const resizeCanvasToDisplaySize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const rect = parent.getBoundingClientRect();
    const targetH = Math.round(
      Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, rect.width * 0.28))
    );

    canvas.style.width = "100%";
    canvas.style.height = `${targetH}px`;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(targetH * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDesktop) return;

      const canvas = canvasRef.current;
      const hm = heightMapRef.current;
      if (!canvas || hm.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const { width, height } = canvas;
      const grid = hm.length;
      const cellX = width / (grid - 1);
      const cellY = height / (grid - 1);

      const theta = (ROTATE_DEG * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2;

      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const cosTheta = Math.cos(-theta);
      const sinTheta = Math.sin(-theta);
      const unrotatedX = dx * cosTheta - dy * sinTheta + cx;
      const unrotatedY = dx * sinTheta + dy * cosTheta + cy;

      const gridX = Math.floor(unrotatedX / cellX);
      const gridY = Math.floor(unrotatedY / cellY);

      if (gridX >= 0 && gridX < grid - 1 && gridY >= 0 && gridY < grid - 1) {
        setHoveredCell({ x: gridX, y: gridY });
      } else {
        setHoveredCell(null);
      }
    },
    [isDesktop, ROTATE_DEG]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  useLayoutEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();

    generateTerrain(GRID);
    resizeCanvasToDisplaySize();
    draw();

    const ro = new ResizeObserver(() => {
      checkDesktop();
      resizeCanvasToDisplaySize();
      draw();
    });
    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement);
    }

    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove as any);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      ro.disconnect();
      mo.disconnect();
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove as any);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [handleMouseMove, handleMouseLeave]);

  useLayoutEffect(() => {
    draw();
  }, [hoveredCell, ROTATE_DEG]);

  return (
    <div
      className="absolute inset-x-0 -top-2 bottom-0 pointer-events-none"
      style={{
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.00) 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.00) 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ pointerEvents: isDesktop ? "auto" : "none" }}
      />
    </div>
  );
}
