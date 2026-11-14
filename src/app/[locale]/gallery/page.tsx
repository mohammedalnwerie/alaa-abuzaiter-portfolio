import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Locale } from "@/content/types";
import { publishedPhotos } from "@/content/gallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PendingSection } from "@/components/common/PendingSection";
import type { Metadata } from "next";

// V4 "Shape Memory" — photo gallery. Shows only approved photos from src/content/gallery.ts.
// With no approved photos the page explains what is needed, is noindex, and is not linked.

const arPhotoCount = (n: number) =>
  n === 1 ? "صورة واحدة" : n === 2 ? "صورتان" : n <= 10 ? `${n} صور` : `${n} صورة`;

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const empty = publishedPhotos().length === 0;
  return {
    title: "Gallery — Dr. Eng. Alaa AbuZaiter",
    description: "Photographs from the lab, conferences and university life of Dr. Eng. Alaa AbuZaiter.",
    ...(empty ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const isAr = locale === "ar";
  const photos = publishedPhotos();

  if (photos.length === 0) {
    return (
      <PendingSection
        locale={locale}
        kicker={{ en: "Gallery", ar: "معرض الصور" }}
        title={{ en: "Photographs.", ar: "الصور." }}
        reason={{
          en: "No photographs have been approved for publication yet. This page is not linked from the site until the first one is.",
          ar: "لم تُعتمد أي صور للنشر بعد. لن ترتبط هذه الصفحة بقوائم الموقع حتى تُعتمد أول صورة.",
        }}
        fields={[
          { en: "The photo file, at full resolution", ar: "ملف الصورة بدقتها الكاملة" },
          { en: "What it shows (one line, Arabic and English)", ar: "ماذا تُظهر (سطر واحد بالعربية والإنجليزية)" },
          { en: "Date (year, or year and month)", ar: "التاريخ (السنة، أو السنة والشهر)" },
          { en: "Place or event", ar: "المكان أو المناسبة" },
          { en: "Category: lab, conference, university, teaching or event", ar: "الفئة: مختبر، مؤتمر، جامعة، تدريس، فعالية" },
          { en: "Photographer, if credit is wanted", ar: "اسم المصوّر إن رُغب في ذكره" },
          { en: "Permission from anyone identifiable in the photo", ar: "موافقة كل شخص يمكن التعرّف عليه في الصورة" },
        ]}
      />
    );
  }

  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr ? "font-kufi text-[13px] font-medium" : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const years = photos.map((p) => p.date?.slice(0, 4)).filter(Boolean).sort() as string[];
  const range = years.length ? (years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`) : "";

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        locale={locale}
        path="gallery"
        title={isAr ? "معرض الصور" : "Gallery"}
        lede={isAr ? `${arPhotoCount(photos.length)}${range ? `، ${range}` : ""}. اختر صورة لعرضها كاملة.` : `${photos.length} ${photos.length === 1 ? "photograph" : "photographs"}${range ? `, ${range}` : ""}. Select one to view it full size.`}
      />

      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 py-14 sm:py-20">
        <GalleryGrid photos={photos} locale={locale} />
      </section>
    </div>
  );
}
