"use client";

import { useEffect, useRef } from "react";

// Homepage hero background: a measured dot lattice (like a MEMS die under a microscope).
// - The pointer acts as a probe: dots near it brighten, turn temper-amber and lean away.
// - A slow scan band sweeps across from the inline-start side, so the field is alive on
//   touch screens too.
// - Static single frame under prefers-reduced-motion; paused when off screen or the tab
//   is hidden. Purely decorative (aria-hidden), no layout impact.

const GAP = 26; // px between dots
const PROBE = 150; // pointer influence radius, px
const SCAN_MS = 7000; // one sweep

export function DotField({ rtl = false }: { rtl?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      // ease the probe toward the pointer for a damped, instrument-like feel
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;

      const phase = reduce ? -1 : ((now - t0) % SCAN_MS) / SCAN_MS;
      const scanX = phase < 0 ? -9999 : rtl ? w - phase * (w + 240) + 120 : phase * (w + 240) - 120;

      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let x = ox + i * GAP;
          let y = oy + j * GAP;
          const major = i % 4 === 0 && j % 4 === 0;

          let a = major ? 0.34 : 0.15;
          let r = major ? 1.25 : 0.9;
          let warm = 0;

          // scan band
          const ds = Math.abs(x - scanX);
          if (ds < 90) {
            const k = 1 - ds / 90;
            a += 0.22 * k * k;
          }

          // probe
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < PROBE) {
            const k = 1 - d / PROBE;
            const push = k * k * 9;
            x += (dx / (d || 1)) * push;
            y += (dy / (d || 1)) * push;
            a += 0.6 * k;
            r += 1.1 * k;
            warm = k;
          }

          // vellum (244,242,234) → temper light (224,174,92)
          const cr = Math.round(244 - 20 * warm);
          const cg = Math.round(242 - 68 * warm);
          const cb = Math.round(234 - 142 * warm);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(a, 0.95)})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const host = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      if (pointer.x < -1000) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [rtl]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
