"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset";
import { GalleryCategory, GalleryPhoto, Locale } from "@/content/types";
import { galleryCategories } from "@/content/gallery";

// V4 "Shape Memory" — photo gallery laid out like a contact sheet:
// numbered frames in date order, category filters, and a full-screen viewer
// (keyboard, swipe, focus return, scroll lock; arrows follow reading direction).

interface GalleryGridProps {
  photos: GalleryPhoto[];
  locale: Locale;
}

export function GalleryGrid({ photos, locale }: GalleryGridProps) {
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);
  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr ? "font-kufi text-[13px] font-medium" : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-temper";

  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [open, setOpen] = useState<number | null>(null); // index into `shown`
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  // frame numbers follow the full, date-ordered set
  const frameNo = useMemo(() => new Map(photos.map((p, i) => [p.id, String(i + 1).padStart(2, "0")])), [photos]);
  const present = useMemo(
    () => (Object.keys(galleryCategories) as GalleryCategory[]).filter((c) => photos.some((p) => p.category === c)),
    [photos]
  );
  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  const go = useCallback(
    (step: number) => setOpen((i) => (i === null ? i : (i + step + shown.length) % shown.length)),
    [shown.length]
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      // reading direction: in Arabic the next photo is to the left
      if (e.key === "ArrowRight") go(isAr ? -1 : 1);
      if (e.key === "ArrowLeft") go(isAr ? 1 : -1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastTrigger.current?.focus();
    };
  }, [open, go, isAr]);

  const meta = (p: GalleryPhoto) =>
    [p.date, p.place?.[locale]].filter(Boolean).join(isAr ? " · " : " · ");

  const current = open !== null ? shown[open] : null;

  return (
    <div>
      {/* Filters */}
      {present.length > 1 && (
        <div role="group" aria-label={L("Filter by category", "تصفية حسب الفئة")} className="flex flex-wrap gap-2">
          {(["all", ...present] as const).map((c) => {
            const on = filter === c;
            const n = c === "all" ? photos.length : photos.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c)}
                className={`${display} ${focus} inline-flex min-h-[44px] items-center gap-2 border px-3.5 text-[14px] font-semibold transition-colors ${
                  on ? "border-ink bg-ink text-vellum" : "border-ink/20 text-ink hover:border-ink"
                }`}
              >
                {c === "all" ? L("All", "الكل") : galleryCategories[c][locale]}
                <span className={`font-plexmono text-[12px] ${on ? "text-vellum/60" : "text-nickel"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Contact sheet */}
      <ol className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {shown.map((p, i) => (
          <li key={p.id}>
            <figure>
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                className={`${focus} group relative block aspect-[4/3] w-full overflow-hidden bg-vellum-deep`}
                aria-label={L(`Open photo ${frameNo.get(p.id)}: ${p.alt.en}`, `فتح الصورة ${frameNo.get(p.id)}: ${p.alt.ar}`)}
              >
                <Image
                  src={assetPath(p.src)}
                  alt={p.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </button>
              <figcaption className="mt-3">
                <p className="flex items-baseline gap-3">
                  <span className="font-plexmono text-[12px] text-temper-text">{frameNo.get(p.id)}</span>
                  <span className={`${label} text-nickel`}>{galleryCategories[p.category][locale]}</span>
                </p>
                {p.caption && <p className={`${prose} mt-1.5 text-[15px] leading-snug text-ink`}>{p.caption[locale]}</p>}
                {meta(p) && <p className="mt-1 font-plexmono text-[12px] text-nickel">{meta(p)}</p>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>

      {/* Viewer */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={L("Photo viewer", "عارض الصور")}
          className="fixed inset-0 z-[80] flex flex-col bg-vellum text-ink"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 50) return;
            // swipe toward the start of the reading direction = next
            go(dx < 0 ? (isAr ? -1 : 1) : isAr ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4">
            <p className={`${isAr ? "font-kufi text-[14px]" : "font-plexmono text-[13px]"} text-ink/70`} aria-live="polite">
              {isAr
                ? `${(open ?? 0) + 1} من ${shown.length}`
                : `${String((open ?? 0) + 1).padStart(2, "0")} / ${String(shown.length).padStart(2, "0")}`}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(null)}
              className={`${display} ${focus} inline-flex min-h-[44px] items-center gap-2 border border-ink/30 px-4 text-[14px] font-semibold hover:border-ink`}
            >
              {L("Close", "إغلاق")}
              <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1 mx-4 sm:mx-20">
            <Image src={assetPath(current.src)} alt={current.alt[locale]} fill sizes="100vw" className="object-contain" priority />
          </div>

          {shown.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={L("Previous photo", "الصورة السابقة")}
                className={`${focus} absolute top-1/2 start-2 sm:start-5 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center border border-ink/30 bg-vellum/60 hover:border-ink`}
              >
                <span aria-hidden className="text-[20px]">{isAr ? "→" : "←"}</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={L("Next photo", "الصورة التالية")}
                className={`${focus} absolute top-1/2 end-2 sm:end-5 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center border border-ink/30 bg-vellum/60 hover:border-ink`}
              >
                <span aria-hidden className="text-[20px]">{isAr ? "←" : "→"}</span>
              </button>
            </>
          )}

          <div className="px-4 sm:px-8 py-5 border-t border-ink/15">
            <p className="flex items-baseline gap-3">
              <span className="font-plexmono text-[12px] text-temper-light">{frameNo.get(current.id)}</span>
              <span className={`${label} text-ink/60`}>{galleryCategories[current.category][locale]}</span>
            </p>
            {current.caption && <p className={`${prose} mt-2 text-[1.05rem] leading-snug`}>{current.caption[locale]}</p>}
            <p className="mt-1 font-plexmono text-[12px] text-ink/60">
              {[meta(current), current.credit ? `${L("Photo", "تصوير")}: ${current.credit}` : ""].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
