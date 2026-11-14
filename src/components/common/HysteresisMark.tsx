import React from "react";

// Site mark: a miniature of Fig. 1 on the homepage — the heating (temper)
// and cooling (anneal) branches of a shape-memory-alloy hysteresis loop.
export function HysteresisMark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <svg viewBox="0 0 40 28" aria-hidden="true" focusable="false" className={className} fill="none">
      <path
        d="M4 6 H21 C27 6 27 22 33 22 H37"
        stroke="rgb(var(--c-temper))"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37 22 H19 C13 22 13 6 7 6 H4"
        stroke="rgb(var(--c-anneal))"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
