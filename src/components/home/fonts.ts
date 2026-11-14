import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";

// V6 type system (docs/DESIGN_PROMPT_V6.md) — sans + mono only, no serif.
// Latin: Archivo (display) + IBM Plex Sans (text) + IBM Plex Mono (data).
// Arabic: Noto Kufi Arabic (display) + IBM Plex Sans Arabic (text).

export const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-kufi", display: "swap" });

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const homeFontVariables = [archivo.variable, plexSans.variable, plexMono.variable, kufi.variable, plexArabic.variable].join(" ");
