import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // V4 "heat-tint" tokens (docs/DESIGN_DIRECTION.md §3)
        // warm = heating / current, cool = cooling / past
        // 2026-11-09: warmed the paper and softened the dark bands (ink.soft) for comfort.
        // ink.DEFAULT stays near-black for text/controls; large dark bands use ink.soft.
        // V6 "Dark Technical" (docs/DESIGN_PROMPT_V6.md): colours are CSS variables so the
        // whole site is dark on screen and light in print. ink = foreground, vellum = surface.
        ink: { DEFAULT: "rgb(var(--c-ink) / <alpha-value>)", soft: "rgb(var(--c-ink-soft) / <alpha-value>)" },
        vellum: { DEFAULT: "rgb(var(--c-bg) / <alpha-value>)", deep: "rgb(var(--c-bg-deep) / <alpha-value>)" },
        plate: "rgb(var(--c-plate) / <alpha-value>)",
        nickel: "rgb(var(--c-nickel) / <alpha-value>)",
        temper: {
          DEFAULT: "rgb(var(--c-temper) / <alpha-value>)",
          text: "rgb(var(--c-temper-text) / <alpha-value>)",
          light: "rgb(var(--c-temper-light) / <alpha-value>)",
          soft: "rgb(var(--c-temper-soft) / <alpha-value>)",
        },
        anneal: {
          DEFAULT: "rgb(var(--c-anneal) / <alpha-value>)",
          light: "rgb(var(--c-anneal-light) / <alpha-value>)",
          soft: "rgb(var(--c-anneal-soft) / <alpha-value>)",
        },
        navy: {
          900: "#0D1826",
          800: "#14243A", // Deep Navy (Primary brand)
          700: "#1B304C",
          600: "#243E62",
          500: "#315482",
        },
        offwhite: {
          50: "#FAFBFC",
          100: "#F7F8FA", // Warm off-white background
          200: "#EFF1F5",
        },
        teal: {
          accent: "#2D9C98", // Muted Teal
          hover: "#237E7B",  // Muted Teal Dark
          light: "#E8F4F3",  // Subtle highlight surface
          glow: "#38B2AC",
        },
        charcoal: {
          900: "#182029",
          800: "#202A35", // Body text primary
          700: "#2C3947",
        },
        slate: {
          muted: "#647184", // Secondary metadata
          subtle: "#8A97A8",
        },
        border: {
          light: "#E3E8EE", // Soft gray border
          subtle: "#EAEFF4",
        },
      },
      fontFamily: {
        // V4 homepage type system
        archivo: ["var(--font-archivo)", "system-ui", "sans-serif"],
        plexsans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        plexmono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        kufi: ["var(--font-kufi)", "var(--font-ibm-plex-sans-arabic)", "sans-serif"],
        plexarabic: ["var(--font-plex-arabic)", "var(--font-kufi)", "sans-serif"],
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-plex-arabic)", "var(--font-kufi)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        academic: "0 1px 3px 0 rgba(20, 36, 58, 0.05), 0 1px 2px -1px rgba(20, 36, 58, 0.05)",
        "academic-hover": "0 10px 25px -5px rgba(20, 36, 58, 0.08), 0 8px 10px -6px rgba(20, 36, 58, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
