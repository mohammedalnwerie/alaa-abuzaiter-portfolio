import { LocalizedString } from "./types";

// Presentation order for the research pillars: from the smart material itself
// to the mechanisms, devices and control systems built on it.
// Used by the homepage research band and the /research page.
export const RESEARCH_LADDER: { id: string; step: LocalizedString }[] = [
  { id: "mems-microactuators", step: { en: "Material", ar: "المادة" } },
  { id: "micro-positioning", step: { en: "Mechanism", ar: "الآلية" } },
  { id: "microrobotics", step: { en: "Manipulation", ar: "المناولة" } },
  { id: "microdevices-biomedical", step: { en: "Devices", ar: "الأجهزة" } },
  { id: "control-automation", step: { en: "Control", ar: "التحكم" } },
  { id: "intelligent-mechatronics-ai", step: { en: "Intelligence", ar: "الذكاء" } },
];

export function arabicPaperCount(n: number) {
  if (n === 1) return "ورقة واحدة مرتبطة";
  if (n === 2) return "ورقتان مرتبطتان";
  if (n >= 3 && n <= 10) return `${n} أوراق مرتبطة`;
  return `${n} ورقة مرتبطة`;
}
