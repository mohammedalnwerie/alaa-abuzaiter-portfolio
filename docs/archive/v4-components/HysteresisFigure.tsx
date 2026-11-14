import React from "react";
import { Locale } from "@/content/types";

// Fig. 1 — schematic strain–temperature hysteresis of a shape-memory-alloy
// actuator under constant bias load. Illustrative only: no measured values,
// no numeric axes. Charts keep LTR orientation in both locales (scientific convention).

const labels = {
  en: {
    title: "Schematic shape-memory-alloy hysteresis loop",
    desc: "Strain plotted against temperature. The heating branch drops from the deformed martensite state to the recovered austenite shape between As and Af; the cooling branch returns between Ms and Mf at lower temperature, forming a hysteresis loop.",
    x: "Temperature",
    y: "Strain",
    martensite: "Martensite",
    martensiteNote: "deformed",
    austenite: "Austenite",
    austeniteNote: "remembered shape",
    heating: "Heating",
    cooling: "Cooling",
  },
  ar: {
    title: "رسم توضيحي لحلقة التخلف الحراري في سبيكة الذاكرة الشكلية",
    desc: "الانفعال مقابل درجة الحرارة. ينخفض مسار التسخين من حالة المارتنسيت المشوّهة إلى شكل الأوستنيت المستعاد بين As وAf، ويعود مسار التبريد بين Ms وMf عند درجة حرارة أقل مكوّناً حلقة تخلف حراري.",
    x: "درجة الحرارة",
    y: "الانفعال",
    martensite: "مارتنسيت",
    martensiteNote: "مشوّه",
    austenite: "أوستنيت",
    austeniteNote: "الشكل المحفوظ",
    heating: "تسخين",
    cooling: "تبريد",
  },
} as const;

export function HysteresisFigure({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const isAr = locale === "ar";
  const textFont = isAr ? "var(--font-kufi)" : "var(--font-archivo)";
  const monoFont = "var(--font-plex-mono)";

  // Plot geometry (viewBox 0 0 520 380)
  const x0 = 56, x1 = 500, yTop = 96, yBot = 280, yAxis = 318;
  const Mf = 128, Ms = 232, As = 288, Af = 404;

  const heating = `M ${x0 + 18} ${yTop} L ${As} ${yTop} C ${As + 62} ${yTop} ${Af - 62} ${yBot} ${Af} ${yBot} L ${x1 - 14} ${yBot}`;
  const cooling = `M ${x1 - 14} ${yBot} L ${Ms} ${yBot} C ${Ms - 62} ${yBot} ${Mf + 62} ${yTop} ${Mf} ${yTop} L ${x0 + 18} ${yTop}`;

  const ticks: { x: number; main: string; sub: string; tone: "heat" | "cool" }[] = [
    { x: Mf, main: "M", sub: "f", tone: "cool" },
    { x: Ms, main: "M", sub: "s", tone: "cool" },
    { x: As, main: "A", sub: "s", tone: "heat" },
    { x: Af, main: "A", sub: "f", tone: "heat" },
  ];

  return (
    <svg
      viewBox="0 0 520 380"
      role="img"
      aria-labelledby="fig1-title fig1-desc"
      direction="ltr"
      className="w-full h-auto overflow-visible"
    >
      <title id="fig1-title">{t.title}</title>
      <desc id="fig1-desc">{t.desc}</desc>

      {/* Fine plotting grid */}
      <g className="hx-fade" style={{ animationDelay: "0.1s" }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={`v${i}`}
            x1={x0 + i * 55.5}
            x2={x0 + i * 55.5}
            y1={64}
            y2={yAxis}
            stroke="#0F1D2E"
            strokeOpacity={0.06}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1={x0}
            x2={x1}
            y1={yAxis - i * 63.5}
            y2={yAxis - i * 63.5}
            stroke="#0F1D2E"
            strokeOpacity={0.06}
          />
        ))}
      </g>

      {/* Axes */}
      <g stroke="#0F1D2E" strokeWidth={1.25} fill="none">
        <path d={`M ${x0} 56 L ${x0} ${yAxis} L ${x1 + 6} ${yAxis}`} />
        <path d={`M ${x1 + 6} ${yAxis} l -8 -4 m 8 4 l -8 4`} />
        <path d={`M ${x0} 56 l -4 8 m 4 -8 l 4 8`} />
      </g>

      {/* Transformation temperature ticks */}
      <g className="hx-fade" style={{ animationDelay: "1.2s" }}>
        {ticks.map((tk) => (
          <g key={tk.main + tk.sub}>
            <line
              x1={tk.x}
              x2={tk.x}
              y1={yAxis}
              y2={tk.tone === "heat" ? yBot : yTop}
              stroke={tk.tone === "heat" ? "#B5761C" : "#2F4FA8"}
              strokeOpacity={0.35}
              strokeDasharray="2 4"
            />
            <line x1={tk.x} x2={tk.x} y1={yAxis} y2={yAxis + 6} stroke="#0F1D2E" />
            <text
              x={tk.x}
              y={yAxis + 22}
              textAnchor="middle"
              fontFamily={monoFont}
              fontSize={13}
              fill={tk.tone === "heat" ? "#8A5410" : "#2F4FA8"}
            >
              {tk.main}
              <tspan fontSize={10} dy={3}>{tk.sub}</tspan>
            </text>
          </g>
        ))}
      </g>

      {/* Cooling branch (drawn second) */}
      <path
        d={cooling}
        pathLength={1}
        fill="none"
        stroke="#2F4FA8"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hx-draw hx-draw--cool"
      />
      {/* Heating branch (drawn first) */}
      <path
        d={heating}
        pathLength={1}
        fill="none"
        stroke="#B5761C"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hx-draw hx-draw--heat"
      />

      {/* Direction arrows */}
      <g className="hx-fade" style={{ animationDelay: "1.5s" }}>
        <path d={`M ${As - 70} ${yTop - 7} l 9 7 l -9 7`} fill="none" stroke="#B5761C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${Ms + 82} ${yBot - 7} l -9 7 l 9 7`} fill="none" stroke="#2F4FA8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Phase annotations */}
      <g className="hx-fade" style={{ animationDelay: "2.6s" }} fontFamily={textFont}>
        <circle cx={x0 + 18} cy={yTop} r={4} fill="#0F1D2E" />
        <text x={x0 + 18} y={yTop - 30} fontSize={15} fontWeight={700} fill="#0F1D2E">
          {t.martensite}
        </text>
        <text x={x0 + 18} y={yTop - 13} fontSize={12} fill="#566170">
          {t.martensiteNote}
        </text>

        <circle cx={x1 - 14} cy={yBot} r={4} fill="#0F1D2E" />
        <text x={x1 - 14} y={yBot - 30} fontSize={15} fontWeight={700} fill="#0F1D2E" textAnchor="end">
          {t.austenite}
        </text>
        <text x={x1 - 14} y={yBot - 13} fontSize={12} fill="#566170" textAnchor="end">
          {t.austeniteNote}
        </text>
      </g>

      {/* Axis titles + legend */}
      <g fontFamily={textFont} fill="#566170" fontSize={12}>
        <text x={x1 + 6} y={yAxis + 48} textAnchor="end">{t.x} →</text>
        <text x={x0 - 14} y={60} textAnchor="end" transform={`rotate(-90 ${x0 - 14} 60)`}>
          {t.y}
        </text>
        <g className="hx-fade" style={{ animationDelay: "0.3s" }}>
          <line x1={x0} x2={x0 + 22} y1={yAxis + 44} y2={yAxis + 44} stroke="#B5761C" strokeWidth={2.75} strokeLinecap="round" />
          <text x={x0 + 30} y={yAxis + 48}>{t.heating}</text>
          <line x1={x0 + 104} x2={x0 + 126} y1={yAxis + 44} y2={yAxis + 44} stroke="#2F4FA8" strokeWidth={2.75} strokeLinecap="round" />
          <text x={x0 + 134} y={yAxis + 48}>{t.cooling}</text>
        </g>
      </g>
    </svg>
  );
}
