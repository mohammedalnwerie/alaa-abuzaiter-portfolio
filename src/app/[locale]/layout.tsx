import React from "react";
import { Locale } from "@/content/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocumentLang } from "@/components/layout/DocumentLang";
import { Spotlight } from "@/components/common/Spotlight";
import { homeFontVariables } from "@/components/home/fonts";
import { publicationsData } from "@/content/publications";
import { coursesData } from "@/content/courses";
import { publishedPhotos } from "@/content/gallery";

export async function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const isRtl = locale === "ar";

  // Counts are derived from the verified data (not hardcoded in the client nav).
  const counts = { publications: publicationsData.length, courses: coursesData.length, gallery: publishedPhotos().length };

  return (
    <div
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${homeFontVariables} bg-paper text-ink min-h-screen flex flex-col ${isRtl ? "font-arabic" : "font-sans"}`}
    >
      <DocumentLang locale={locale} />
      <Spotlight />
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-vellum ${isRtl ? "font-kufi" : "font-archivo"}`}
      >
        {isRtl ? "تخطَّ إلى المحتوى" : "Skip to content"}
      </a>
      <Navbar locale={locale} counts={counts} />
      <main id="main" className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
