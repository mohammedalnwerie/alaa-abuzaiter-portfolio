"use client";

import { useEffect } from "react";

// Adds `is-in` to every [data-reveal] element as it scrolls into view.
// Content is fully visible without JS; hiding only starts once this runs,
// and never under prefers-reduced-motion.
// IntersectionObserver is the primary trigger; a passive scroll check is a
// fallback for environments where observer callbacks are throttled.
export function RevealController() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const root = document.documentElement;
    const pending = new Set(els);
    const reveal = (el: Element) => {
      el.classList.add("is-in");
      pending.delete(el as HTMLElement);
    };

    const check = () => {
      const limit = window.innerHeight * 0.92;
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < limit && r.bottom > 0) reveal(el);
      });
      if (pending.size === 0) {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };

    // Elements already on screen are revealed immediately to avoid a flash.
    check();
    root.classList.add("reveal-on");

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              io?.unobserve(entry.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
      );
      pending.forEach((el) => io!.observe(el));
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      root.classList.remove("reveal-on");
    };
  }, []);

  return null;
}
