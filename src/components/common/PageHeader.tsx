import React from "react";
import { Locale } from "@/content/types";

// V6 page header (docs/DESIGN_PROMPT_V6.md): a mono path, a plain title, one short line.
// Optional `aside` (stats, actions) sits on the inline-end side on large screens.
export function PageHeader({
  locale,
  path,
  title,
  lede,
  aside,
}: {
  locale: Locale;
  path: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const isAr = locale === "ar";
  const display = isAr ? "font-kufi" : "font-archivo";
  const text = isAr ? "font-plexarabic" : "font-plexsans";

  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-end gap-x-12 gap-y-8 px-4 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-16 lg:grid-cols-12">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <p className="hero-in flex items-center gap-2 font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}>
            <span className="text-nickel">~/</span>
            {path}
            <span aria-hidden className="ms-1 inline-block h-[13px] w-[7px] animate-pulse bg-temper/80" />
          </p>
          <h1 className={`${display} hero-in mt-4 text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[2.7rem] rtl:tracking-normal rtl:leading-[1.4]`} style={{ ["--d" as string]: "70ms" }}>
            {title}
          </h1>
          {lede && (
            <p className={`${text} hero-in mt-4 max-w-[42rem] text-[15.5px] leading-[1.7] text-nickel sm:text-[16.5px]`} style={{ ["--d" as string]: "140ms" }}>
              {lede}
            </p>
          )}
        </div>
        {aside && (
          <div className="hero-in lg:col-span-5" style={{ ["--d" as string]: "200ms" }}>
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
