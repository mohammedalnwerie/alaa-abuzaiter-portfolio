"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/content/types";
import { getDictionary } from "@/content/translations";
import { HysteresisMark } from "@/components/common/HysteresisMark";

// V4 shell navigation — "Shape Memory" system (docs/DESIGN_DIRECTION.md).
// Same routes and grouping as V3; short group labels keep the bar on one line.

interface NavbarProps {
  locale: Locale;
  counts: { publications: number; courses: number; gallery: number };
}

type NavItem = { href: string; label: string; meta?: string };
type NavGroup = { key: string; label: string; match: string[]; items: NavItem[] };

const SHORT = {
  en: { profile: "Profile", research: "Research", teaching: "Teaching", activities: "Activities", cv: "CV", contact: "Contact", menu: "Menu", close: "Close", draft: "Draft", mainNav: "Main navigation" },
  ar: { profile: "الملف", research: "البحث", teaching: "التدريس", activities: "الأنشطة", cv: "السيرة الذاتية", contact: "التواصل", menu: "القائمة", close: "إغلاق", draft: "مسودة", mainNav: "التنقل الرئيسي" },
} as const;

export function Navbar({ locale, counts }: NavbarProps) {
  const pathname = usePathname();
  const dict = getDictionary(locale);
  const s = SHORT[locale];
  const isAr = locale === "ar";
  const display = isAr ? "font-kufi" : "font-archivo";
  const label = isAr ? "font-kufi text-[13px]" : "font-plexmono text-[12px] tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-temper";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const p = (slug: string) => `/${locale}/${slug}`;
  const groups: NavGroup[] = [
    {
      key: "profile",
      label: s.profile,
      match: ["/about", "/academic-journey", "/leadership"],
      items: [
        { href: p("about"), label: dict.nav.about },
        { href: p("academic-journey"), label: dict.nav.academicJourney },
        { href: p("leadership"), label: dict.nav.leadership },
      ],
    },
    {
      key: "research",
      label: s.research,
      match: ["/research", "/publications", "/conferences"],
      items: [
        { href: p("research"), label: dict.nav.researchAreas },
        { href: p("publications"), label: dict.nav.publications, meta: String(counts.publications) },
        { href: p("conferences"), label: dict.nav.academicEvents },
      ],
    },
    {
      key: "teaching",
      label: s.teaching,
      match: ["/teaching", "/supervision"],
      items: [
        { href: p("teaching"), label: dict.nav.courses, meta: String(counts.courses) },
        { href: p("supervision"), label: dict.nav.supervision, meta: s.draft },
      ],
    },
    {
      key: "activities",
      label: s.activities,
      match: ["/activities", "/awards", "/gallery"],
      items: [
        { href: p("activities"), label: dict.nav.professionalDev },
        { href: p("awards"), label: dict.nav.awards },
        // the gallery is linked only once at least one photo is approved
        ...(counts.gallery > 0 ? [{ href: p("gallery"), label: isAr ? "معرض الصور" : "Gallery", meta: String(counts.gallery) }] : []),
      ],
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const groupActive = (g: NavGroup) => g.match.some((m) => pathname.includes(m));

  const targetLocale: Locale = isAr ? "en" : "ar";
  const switchLocalePath = pathname.replace(`/${locale}`, `/${targetLocale}`) || `/${targetLocale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpen(null);
  }, [pathname]);

  // Outside click + Escape
  const closeAll = useCallback(() => {
    setOpen(null);
    setMobileOpen(false);
  }, []);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeAll]);

  // Lock page scroll behind the mobile drawer
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const topLink = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-[14.5px] font-semibold transition-colors ${display} ${focus} ${
      active ? "text-ink" : "text-ink/70 hover:text-ink"
    }`;
  const activeBar = (active: boolean) =>
    active ? <span aria-hidden className="absolute inset-x-3 -bottom-[17px] h-[2px] bg-temper" /> : null;

  return (
    <header
      className={`print:hidden sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || mobileOpen ? "bg-vellum/95 backdrop-blur-md border-ink/15" : "bg-vellum border-ink/10"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <div className="flex h-16 lg:h-[72px] items-center justify-between gap-6">
          {/* Wordmark */}
          <Link href={`/${locale}`} className={`group flex min-w-0 items-center gap-3 ${focus}`}>
            <HysteresisMark className="h-6 w-9 flex-none transition-transform duration-300 group-hover:scale-105" />
            <span className="min-w-0">
              <span className={`${display} block truncate text-[16px] sm:text-[17px] font-bold leading-tight text-ink`}>
                {isAr ? "د.م. علاء أبو زعيتر" : "Dr. Eng. Alaa AbuZaiter"}
              </span>
              <span className={`${isAr ? "font-kufi text-[12px]" : "font-plexmono text-[11px] tracking-[0.01em]"} block truncate text-nickel`}>
                {isAr ? "أستاذ مساعد · عميد كلية هندسة البرمجيات والذكاء الاصطناعي" : "Assistant Professor · Dean, SE & AI"}
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav ref={navRef} aria-label={s.mainNav} className="hidden xl:flex items-center">
            <ul className="flex items-center">
              {groups.map((g) => {
                const active = groupActive(g);
                const expanded = open === g.key;
                return (
                  <li key={g.key} className="relative" onMouseEnter={() => setOpen(g.key)} onMouseLeave={() => setOpen(null)}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`nav-${g.key}`}
                      onClick={() => setOpen(expanded ? null : g.key)}
                      className={topLink(active)}
                    >
                      {g.label}
                      <svg aria-hidden viewBox="0 0 10 6" className={`h-[6px] w-[10px] transition-transform ${expanded ? "rotate-180" : ""}`}>
                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {activeBar(active)}
                    </button>

                    <div
                      id={`nav-${g.key}`}
                      hidden={!expanded}
                      className="absolute start-0 top-full pt-3"
                    >
                      <ul className="w-72 border border-ink/15 border-t-2 border-t-ink bg-vellum py-2 shadow-[0_18px_40px_-20px_rgba(15,29,46,0.35)]">
                        {g.items.map((it) => {
                          const on = isActive(it.href);
                          return (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                aria-current={on ? "page" : undefined}
                                className={`flex items-center justify-between gap-4 px-4 py-2.5 text-[15px] ${display} ${focus} transition-colors hover:bg-vellum-deep ${
                                  on ? "text-temper-text font-semibold" : "text-ink"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <span aria-hidden className={`h-3.5 w-[2px] ${on ? "bg-temper" : "bg-transparent"}`} />
                                  {it.label}
                                </span>
                                {it.meta && (
                                  <span className={`${/^\d+$/.test(it.meta) ? "font-plexmono text-[12px]" : `${label}`} text-nickel`}>
                                    {it.meta}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}

              <li aria-hidden className="mx-2 h-5 w-px bg-ink/15" />

              <li>
                <Link href={p("cv")} aria-current={isActive(p("cv")) ? "page" : undefined} className={topLink(isActive(p("cv")))}>
                  {s.cv}
                  {activeBar(isActive(p("cv")))}
                </Link>
              </li>
              <li>
                <Link href={p("contact")} aria-current={isActive(p("contact")) ? "page" : undefined} className={topLink(isActive(p("contact")))}>
                  {s.contact}
                  {activeBar(isActive(p("contact")))}
                </Link>
              </li>
              <li className="ms-3">
                <Link
                  href={switchLocalePath}
                  hrefLang={targetLocale}
                  lang={targetLocale}
                  className={`${isAr ? "font-archivo" : "font-kufi"} inline-flex items-center border border-ink/25 px-3.5 py-1.5 text-[14px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-vellum ${focus}`}
                >
                  {dict.nav.switchLanguage}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Compact controls */}
          <div className="flex flex-none items-center gap-2 xl:hidden">
            <Link
              href={switchLocalePath}
              hrefLang={targetLocale}
              lang={targetLocale}
              className={`${isAr ? "font-archivo" : "font-kufi"} inline-flex h-10 items-center border border-ink/25 px-3 text-[13px] font-semibold text-ink ${focus}`}
            >
              {isAr ? "EN" : "عربي"}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className={`inline-flex h-10 items-center gap-2 bg-ink px-3.5 text-[13px] font-semibold text-vellum ${display} ${focus}`}
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span className={`absolute inset-x-0 top-0 h-[2px] bg-current transition-transform ${mobileOpen ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-current transition-transform ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
              {mobileOpen ? s.close : s.menu}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="xl:hidden absolute inset-x-0 top-full h-[calc(100dvh-64px)] overflow-y-auto border-t border-ink/15 bg-vellum"
      >
        <nav aria-label={s.mainNav} className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-6 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {groups.map((g) => (
              <div key={g.key}>
                <p className={`${label} text-temper-text mb-2`}>{g.label}</p>
                <ul className="border-t border-ink/15">
                  {g.items.map((it) => {
                    const on = isActive(it.href);
                    return (
                      <li key={it.href} className="border-b border-ink/10">
                        <Link
                          href={it.href}
                          aria-current={on ? "page" : undefined}
                          className={`flex min-h-[48px] items-center justify-between gap-4 py-2.5 text-[17px] ${display} ${focus} ${
                            on ? "font-semibold text-temper-text" : "text-ink"
                          }`}
                        >
                          {it.label}
                          {it.meta && (
                            <span className={`${/^\d+$/.test(it.meta) ? "font-plexmono text-[13px]" : label} text-nickel`}>{it.meta}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={p("cv")}
              className={`${display} ${focus} flex min-h-[52px] items-center justify-center border border-ink/30 text-[15px] font-semibold text-ink`}
            >
              {dict.nav.cv}
            </Link>
            <Link
              href={p("contact")}
              className={`${display} ${focus} flex min-h-[52px] items-center justify-center bg-ink text-[15px] font-semibold text-vellum`}
            >
              {dict.nav.contact}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
