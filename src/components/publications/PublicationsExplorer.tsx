"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Publication, PublicationType, Locale } from "@/content/types";
import { getDictionary } from "@/content/translations";

// V6 "Dark Technical" publications catalogue (docs/DESIGN_PROMPT_V6.md).
// Preserved behaviour (relied on by scripts/run_qa_suite.js and test_search.js):
// text search input[type="text"], one <article> per result, type filter buttons
// labelled from the dictionary, citation dialog showing "APA 7th Edition" and "BibTeX".

interface PublicationsExplorerProps {
  publications: Publication[];
  locale: Locale;
}

type TypeFilter = PublicationType | "all";

const stripCount = (s: string) => s.replace(/\s*\(\d+\)\s*$/, "");

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-temper-soft text-ink rounded-[2px] px-[1px]">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function PublicationsExplorer({ publications, locale }: PublicationsExplorerProps) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);
  const display = isAr ? "font-kufi" : "font-archivo";
  const label = isAr ? "font-kufi text-[13px] font-medium" : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-temper";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [citing, setCiting] = useState<Publication | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<"bibtex" | "apa" | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const matchesQuery = (pub: Publication) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      pub.title.toLowerCase().includes(q) ||
      pub.authors.some((a) => a.toLowerCase().includes(q)) ||
      pub.sourceName.toLowerCase().includes(q) ||
      !!pub.doi?.toLowerCase().includes(q) ||
      pub.year.toString().includes(q)
    );
  };
  const matchesType = (pub: Publication) => selectedType === "all" || pub.type === selectedType;

  const filtered = useMemo(
    () =>
      publications.filter(
        (p) => matchesType(p) && matchesQuery(p) && (selectedYear === null || p.year === selectedYear)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [publications, selectedType, searchQuery, selectedYear]
  );

  // Group results by year, newest first
  const groups = useMemo(() => {
    const m = new Map<number, Publication[]>();
    filtered.forEach((p) => m.set(p.year, [...(m.get(p.year) ?? []), p]));
    const order = { journal: 0, conference: 1, "book-chapter": 2 } as const;
    return Array.from(m.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, list]) => ({ year, list: list.sort((a, b) => order[a.type] - order[b.type]) }));
  }, [filtered]);

  const counts = {
    all: publications.length,
    journal: publications.filter((p) => p.type === "journal").length,
    conference: publications.filter((p) => p.type === "conference").length,
    "book-chapter": publications.filter((p) => p.type === "book-chapter").length,
  };

  const minYear = Math.min(...publications.map((p) => p.year));
  const maxYear = Math.max(...publications.map((p) => p.year));
  const stripYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const typeName: Record<PublicationType, string> = {
    journal: L("Journal article", "مقال في مجلة"),
    conference: L("Conference paper", "ورقة مؤتمر"),
    "book-chapter": L("Book chapter", "فصل في كتاب"),
  };
  const typeNote: Record<PublicationType, string> = {
    journal: dict.publications.peerReviewed,
    conference: dict.publications.conferencePaperNote,
    "book-chapter": dict.publications.bookChapterNote,
  };

  const filters: { key: TypeFilter; text: string; n: number }[] = [
    { key: "all", text: stripCount(dict.publications.tabAll), n: counts.all },
    { key: "journal", text: stripCount(dict.publications.tabJournals), n: counts.journal },
    { key: "conference", text: stripCount(dict.publications.tabConferences), n: counts.conference },
    { key: "book-chapter", text: stripCount(dict.publications.tabChapters), n: counts["book-chapter"] },
  ];

  const anyFilter = searchQuery.trim() !== "" || selectedType !== "all" || selectedYear !== null;
  const clearAll = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedYear(null);
  };

  const copy = async (text: string, format: "bibtex" | "apa") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable — the text stays selectable */
    }
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Dialog: focus, Escape, scroll lock, focus restore
  useEffect(() => {
    if (!citing) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCiting(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastTrigger.current?.focus();
    };
  }, [citing]);

  return (
    <div>
      {/* ---------------- Console ---------------- */}
      <div className="panel p-5 sm:p-7">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-7">
        <div className="lg:col-span-7">
          <label htmlFor="pub-search" className={`${label} text-nickel`}>
            {L("Search the record", "ابحث في السجل")}
          </label>
          <div className="relative mt-3">
            <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 start-3.5 text-temper">
              <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="pub-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.common.searchPlaceholder}
              autoComplete="off"
              className={`${display} w-full border border-ink/20 bg-vellum/70 py-3 ps-11 pe-10 text-[1.02rem] sm:text-[1.1rem] text-ink placeholder:text-ink/40 transition-colors focus:border-temper focus:outline-none focus:ring-0`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label={L("Clear search", "مسح البحث")}
                className={`absolute end-2 top-1/2 -translate-y-1/2 p-2 text-ink/60 hover:text-ink ${focus}`}
              >
                <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className={`${label} text-nickel`} id="type-filter-label">
            {L("Type", "النوع")}
          </p>
          <div role="group" aria-labelledby="type-filter-label" className="mt-3 flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = selectedType === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelectedType(f.key)}
                  className={`${display} ${focus} inline-flex min-h-[44px] items-center gap-2 border px-3.5 text-[14px] font-semibold transition-colors ${
                    on ? "border-temper bg-temper/10 text-temper-text" : "border-ink/20 text-ink hover:border-ink/50"
                  }`}
                >
                  {f.key !== "all" && <span aria-hidden className={`rec rec--${f.key}`} />}
                  {f.text}
                  <span className={`font-plexmono text-[12px] ${on ? "text-temper-text/80" : "text-nickel"}`}>{f.n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- Year strip (filter) ---------------- */}
      <div className="mt-8 border-t border-ink/10 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className={`${label} text-nickel`} id="year-filter-label">
            {L("By year — select to filter", "حسب السنة — اختر للتصفية")}
          </p>
          {selectedYear !== null && (
            <button type="button" onClick={() => setSelectedYear(null)} className={`${display} ${focus} text-[13px] font-semibold text-temper-text underline underline-offset-4`}>
              {L(`Show all years`, `عرض كل السنوات`)}
            </button>
          )}
        </div>
        <div role="group" aria-labelledby="year-filter-label" className="mt-3 grid grid-cols-[repeat(13,minmax(0,1fr))] border-b border-ink/25" dir="ltr">
          {stripYears.map((y) => {
            const all = publications.filter((p) => p.year === y);
            const live = all.filter((p) => matchesType(p) && matchesQuery(p));
            const on = selectedYear === y;
            const empty = all.length === 0;
            return (
              <button
                key={y}
                type="button"
                disabled={empty}
                aria-pressed={on}
                aria-label={L(`${y}: ${all.length} works`, `${y}: ${all.length} أعمال`)}
                onClick={() => setSelectedYear(on ? null : y)}
                className={`${focus} group flex min-h-[92px] flex-col-reverse items-center gap-[6px] pb-3 pt-2 border-s border-ink/[0.07] first:border-s-0 transition-colors ${
                  on ? "bg-ink/[0.06]" : empty ? "cursor-default" : "hover:bg-ink/[0.03]"
                }`}
              >
                {all
                  .sort((a, b) => ({ journal: 0, conference: 1, "book-chapter": 2 }[a.type] - { journal: 0, conference: 1, "book-chapter": 2 }[b.type]))
                  .map((p) => (
                    <span
                      key={p.id}
                      aria-hidden
                      className={`rec rec--${p.type} transition-opacity ${live.includes(p) && (selectedYear === null || on) ? "" : "opacity-20"}`}
                    />
                  ))}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] pt-2" aria-hidden dir="ltr">
          {stripYears.map((y) => (
            <span key={y} className={`text-center font-plexmono text-[11px] sm:text-[12px] ${selectedYear === y ? "font-medium text-ink" : "text-nickel"}`}>
              <bdi dir="ltr" className="sm:hidden">’{String(y).slice(2)}</bdi>
              <span className="hidden sm:inline">{y}</span>
            </span>
          ))}
        </div>
      </div>

      </div>

      {/* ---------------- Status ---------------- */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pb-2" aria-live="polite">
        <p className={`text-[13.5px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`}>
          {isAr
            ? `عرض ${filtered.length} من أصل ${publications.length} عملاً علمياً موثقاً`
            : `Showing ${filtered.length} of ${publications.length} verified scholarly works`}
        </p>
        {anyFilter && (
          <button type="button" onClick={clearAll} className={`${display} ${focus} text-[14px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.common.clearFilters}
          </button>
        )}
      </div>

      {/* ---------------- Catalogue ---------------- */}
      {filtered.length === 0 ? (
        <div className="panel mt-6 p-8 sm:p-10">
          <p className={`${display} text-[1.3rem] font-semibold`}>{dict.common.noResults}</p>
          <p className={`mt-2 text-[15px] text-nickel ${isAr ? "font-kufi" : ""}`}>
            {L("Try a shorter term — an author surname, a journal or a year — or clear the filters.", "جرّب كلمة أقصر — اسم مؤلف أو مجلة أو سنة — أو أعد ضبط التصفية.")}
          </p>
          <button type="button" onClick={clearAll} className={`${display} ${focus} mt-6 inline-flex min-h-[44px] items-center bg-ink px-5 text-[14px] font-semibold text-vellum`}>
            {dict.common.clearFilters}
          </button>
        </div>
      ) : (
        groups.map(({ year, list }) => (
          <section key={year} aria-label={String(year)} className="mt-8">
            <h2 className="flex items-center gap-4">
              <span className="font-plexmono text-[14px] font-medium text-temper-text">{year}</span>
              <span aria-hidden className="h-px flex-1 bg-ink/10" />
              <span className={`text-[12.5px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`}>
                {isAr ? (list.length === 1 ? "عمل واحد" : list.length === 2 ? "عملان" : `${list.length} أعمال`) : `${list.length} ${list.length === 1 ? "work" : "works"}`}
              </span>
            </h2>
            <div className="mt-4 space-y-3">
              {list.map((pub) => {
                const open = !!expanded[pub.id];
                return (
                  <article key={pub.id} className="panel grid grid-cols-1 md:grid-cols-10 gap-x-8 gap-y-4 p-5 sm:p-6">
                    <div className="md:col-span-7">
                      <p className={`${label} flex items-center gap-2 text-nickel`}>
                        <span aria-hidden className={`rec rec--${pub.type}`} />
                        {typeName[pub.type]}
                        <span className="sr-only"> — {typeNote[pub.type]}</span>
                      </p>
                      <div dir="ltr" lang="en" className="text-left">
                        <h3 className="mt-3 font-archivo text-[1.08rem] sm:text-[1.2rem] font-semibold leading-[1.35] text-ink">
                          <Highlight text={pub.title} query={searchQuery} />
                        </h3>
                        <p className="mt-2.5 text-[13.5px] leading-relaxed text-nickel">
                          {pub.authors.map((a, i) => (
                            <React.Fragment key={a}>
                              {a.includes("AbuZaiter") ? <strong className="font-semibold text-ink">{a}</strong> : <Highlight text={a} query={searchQuery} />}
                              {i < pub.authors.length - 1 ? ", " : ""}
                            </React.Fragment>
                          ))}
                        </p>
                        <p className="mt-1.5 font-plexsans italic text-[14.5px] text-ink/80">
                          <Highlight text={pub.sourceName} query={searchQuery} />
                        </p>
                        <p className="mt-1 font-plexmono text-[12.5px] text-nickel">
                          {[
                            pub.publisher,
                            pub.volume && pub.volume !== String(pub.year) ? `Vol. ${pub.volume}${pub.issue ? `(${pub.issue})` : ""}` : null,
                            pub.pages ? (/^\d|–/.test(pub.pages) ? `pp. ${pub.pages}` : pub.pages) : null,
                            pub.location,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>

                      {pub.statusNote && (
                        <p className={`mt-3 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>{pub.statusNote[locale]}</p>
                      )}

                      {pub.abstract && (
                        <div className="mt-4">
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={`abs-${pub.id}`}
                            onClick={() => setExpanded((s) => ({ ...s, [pub.id]: !s[pub.id] }))}
                            className={`${display} ${focus} inline-flex items-center gap-2 text-[14px] font-semibold text-anneal`}
                          >
                            <svg aria-hidden viewBox="0 0 10 6" className={`h-[6px] w-[10px] transition-transform ${open ? "rotate-180" : ""}`}>
                              <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {open ? L("Hide summary", "إخفاء الملخص") : L("Read summary", "عرض الملخص")}
                          </button>
                          <p
                            id={`abs-${pub.id}`}
                            hidden={!open}
                            className={`${isAr ? "font-plexarabic text-[16.5px] leading-[1.9]" : "font-plexsans text-[16px] leading-[1.7]"} mt-3 border-s-2 border-anneal/40 ps-4 text-ink/80`}
                          >
                            {pub.abstract[locale]}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 flex flex-col items-start gap-3 border-t border-ink/10 pt-4 md:border-t-0 md:border-s md:ps-6 md:pt-1 text-[13.5px]">
                      {pub.doi ? (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className={`${focus} font-plexmono break-all text-anneal underline decoration-anneal/30 underline-offset-4 hover:decoration-anneal`}
                        >
                          doi:<Highlight text={pub.doi} query={searchQuery} /> <span aria-hidden>↗</span>
                          <span className="sr-only">{L(" (opens the publisher's record)", " (يفتح سجل الناشر)")}</span>
                        </a>
                      ) : (
                        <span className={`text-nickel ${isAr ? "font-kufi" : ""}`}>{L("No DOI listed", "لا يوجد معرّف DOI")}</span>
                      )}
                      {pub.publisherUrl && (
                        <a
                          href={pub.publisherUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${display} ${focus} text-nickel hover:text-ink`}
                        >
                          {dict.publications.publisherLink} <span aria-hidden>↗</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          lastTrigger.current = e.currentTarget;
                          setCiting(pub);
                        }}
                        className={`${display} ${focus} mt-1 inline-flex min-h-[40px] items-center border border-ink/25 px-3.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-temper hover:text-temper-text`}
                      >
                        {dict.publications.copyCitation}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}

      {/* ---------------- Citation dialog ---------------- */}
      {citing && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && setCiting(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cite-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-ink/15 border-t-2 border-t-temper bg-vellum-deep p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-start justify-between gap-6 border-b border-ink/15 pb-5">
              <div className="min-w-0">
                <h2 id="cite-title" className={`${display} text-[1.25rem] font-bold`}>{dict.publications.citationDrawerTitle}</h2>
                <p className="mt-1 font-plexsans text-[15px] text-nickel line-clamp-2" dir="ltr" lang="en" style={{ textAlign: isAr ? "right" : "left" }}>
                  {citing.title}
                </p>
              </div>
              <button
                ref={closeBtn}
                type="button"
                onClick={() => setCiting(null)}
                aria-label={L("Close", "إغلاق")}
                className={`${focus} flex-none p-2 text-ink/70 hover:text-ink`}
              >
                <svg aria-hidden viewBox="0 0 14 14" className="h-4 w-4">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {citing.citationApa && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-plexmono text-[13px] font-medium text-nickel">APA 7th Edition</span>
                  <button type="button" onClick={() => copy(citing.citationApa!, "apa")} className={`${display} ${focus} text-[13.5px] font-semibold text-temper-text underline underline-offset-4`}>
                    {copiedFormat === "apa" ? dict.common.copied : L("Copy APA", "نسخ APA")}
                  </button>
                </div>
                <p dir="ltr" lang="en" className="mt-3 select-all border-s-2 border-temper ps-4 text-left font-plexsans text-[15.5px] leading-[1.7] text-ink">
                  {citing.citationApa}
                </p>
              </div>
            )}

            {citing.citationBibtex && (
              <div className="mt-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-plexmono text-[13px] font-medium text-nickel">BibTeX</span>
                  <button type="button" onClick={() => copy(citing.citationBibtex!, "bibtex")} className={`${display} ${focus} text-[13.5px] font-semibold text-temper-text underline underline-offset-4`}>
                    {copiedFormat === "bibtex" ? dict.common.copied : L("Copy BibTeX", "نسخ BibTeX")}
                  </button>
                </div>
                <pre dir="ltr" className="mt-3 select-all overflow-x-auto border border-ink/10 bg-vellum/80 p-4 text-left font-plexmono text-[12.5px] leading-relaxed text-ink/90">
                  {citing.citationBibtex}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
