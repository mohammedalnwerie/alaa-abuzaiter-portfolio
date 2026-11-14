"use client";

import { useEffect, useRef, useState } from "react";

// Small motion primitives for the homepage. Server-rendered output is always the final,
// correct text/number (no-JS and crawlers see real content); motion only runs on the client
// and never under prefers-reduced-motion.

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onVisible(el: Element, cb: () => void) {
  if (!("IntersectionObserver" in window)) {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        cb();
        io.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  io.observe(el);
  return () => io.disconnect();
}

/* --------------------------------------------------------------------------
   Decode: Latin/mono text resolves from random glyphs, start → end.
   Arabic (joined script) is not scrambled; it gets the CSS mask reveal instead.
   -------------------------------------------------------------------------- */
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/<>#*+=";
const ARABIC = /[؀-ۿ]/;

export function Decode({
  text,
  className = "",
  delay = 0,
  duration = 900,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (reduced() || ARABIC.test(text) || !ref.current) return;
    let raf = 0;
    let timer = 0;
    const stop = onVisible(ref.current, () => {
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const settled = Math.floor(p * text.length);
          let s = "";
          for (let i = 0; i < text.length; i++) {
            const c = text[i];
            s += i < settled || c === " " || c === "·" ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          setOut(s);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, delay);
    });
    return () => {
      stop();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      setOut(text);
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}

/* --------------------------------------------------------------------------
   CountUp: integer counts from 0 to `to` with an expo-out ease when in view.
   -------------------------------------------------------------------------- */
export function CountUp({ to, className = "", duration = 1400 }: { to: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    if (reduced() || !ref.current) return;
    let raf = 0;
    const el = ref.current;
    setN(0);
    const stop = onVisible(el, () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setN(Math.round(to * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      stop();
      cancelAnimationFrame(raf);
      setN(to);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span className="sr-only">{to}</span>
      <span aria-hidden>{n}</span>
    </span>
  );
}
