import { GalleryPhoto, GalleryCategory, LocalizedString } from "./types";

// Photo gallery (/gallery). See docs/GALLERY.md for how to add photos.
// Rules: real photos only (no AI-generated or stock images of people), a written
// description (alt) in both languages, and `approved: true` only after Dr. AbuZaiter
// approves the photo and anyone identifiable in it has consented.
// The gallery page, menu link and footer link appear only when at least one photo is approved.
// Photos supplied and approved by Dr. AbuZaiter (2026-11-08). `alt` describes what is
// visible; `date`/`place` are set only where evidenced by the image or the CV.
export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "isms-2014-langkawi",
    src: "/gallery/isms-2014-langkawi.jpg",
    alt: {
      en: "Group photo of attendees in front of the ISMS 2014 conference backdrop",
      ar: "صورة جماعية للمشاركين أمام خلفية مؤتمر ISMS 2014",
    },
    caption: {
      en: "ISMS 2014 conference",
      ar: "مؤتمر ISMS 2014",
    },
    date: "2014-01",
    place: { en: "Langkawi, Malaysia", ar: "لنكاوي، ماليزيا" },
    category: "conference",
    approved: true,
  },
  {
    id: "faculty-graduation-gowns",
    src: "/gallery/faculty-graduation-gowns.jpg",
    alt: {
      en: "Dr. AbuZaiter with faculty colleagues in academic gowns at a graduation ceremony",
      ar: "د. أبو زعيتر مع زملاء من هيئة التدريس بالأزياء الأكاديمية في حفل تخرج",
    },
    caption: { en: "Faculty at a graduation ceremony", ar: "هيئة التدريس في حفل تخرج" },
    category: "event",
    approved: true,
  },
  {
    id: "dean-intermediate-studies-office",
    src: "/gallery/dean-intermediate-studies-office.jpg",
    alt: {
      en: "Dr. AbuZaiter at his office desk; the nameplate reads Dean of the College of Intermediate Studies",
      ar: "د. أبو زعيتر على مكتبه، واللوحة أمامه مكتوب عليها عميد كلية الدراسات المتوسطة",
    },
    caption: {
      en: "As Dean of the College of Intermediate Studies, University of Palestine",
      ar: "عميداً لكلية الدراسات المتوسطة، جامعة فلسطين",
    },
    place: { en: "University of Palestine, Gaza, Palestine", ar: "جامعة فلسطين، غزة، فلسطين" },
    category: "university",
    approved: true,
  },
  {
    id: "biomedical-engineering-lab",
    src: "/gallery/biomedical-engineering-lab.jpg",
    alt: {
      en: "Dr. AbuZaiter with colleagues in a biomedical engineering simulation lab with hospital beds",
      ar: "د. أبو زعيتر مع زملاء في مختبر محاكاة للهندسة الطبية الحيوية مزوّد بأسرّة طبية",
    },
    caption: { en: "Biomedical engineering lab", ar: "مختبر الهندسة الطبية الحيوية" },
    category: "lab",
    approved: true,
  },
  {
    id: "academic-meeting-council",
    src: "/gallery/academic-meeting-council.jpg",
    alt: {
      en: "Dr. AbuZaiter at a formal academic meeting around a council table with a map of Palestine on the wall",
      ar: "د. أبو زعيتر في اجتماع أكاديمي رسمي حول طاولة مجلس، وعلى الجدار خريطة فلسطين",
    },
    caption: { en: "A formal academic meeting", ar: "اجتماع أكاديمي رسمي" },
    category: "university",
    approved: true,
  },
  {
    id: "academic-meeting-session",
    src: "/gallery/academic-meeting-session.jpg",
    alt: {
      en: "A formal academic meeting in session around a council table",
      ar: "جلسة اجتماع أكاديمي رسمي حول طاولة مجلس",
    },
    caption: { en: "In a council session", ar: "في جلسة مجلس" },
    category: "university",
    approved: true,
  },
  {
    id: "academic-meeting-discussion",
    src: "/gallery/academic-meeting-discussion.jpg",
    alt: {
      en: "Dr. AbuZaiter at the head of a table during a working meeting with colleagues",
      ar: "د. أبو زعيتر على رأس الطاولة خلال اجتماع عمل مع زملاء",
    },
    caption: { en: "A working meeting", ar: "اجتماع عمل" },
    category: "university",
    approved: true,
  },
  {
    id: "appreciation-plaque",
    src: "/gallery/appreciation-plaque.jpg",
    alt: {
      en: "Dr. AbuZaiter holding an appreciation shield with colleagues at an official gathering",
      ar: "د. أبو زعيتر يحمل درع تكريم مع زملاء في مناسبة رسمية",
    },
    caption: { en: "An appreciation at an official gathering", ar: "تكريم في مناسبة رسمية" },
    category: "event",
    approved: true,
  },
  {
    id: "intermediate-studies-graduation-honoring",
    src: "/gallery/intermediate-studies-graduation-honoring.jpg",
    alt: {
      en: "Dr. AbuZaiter receiving an appreciation plaque at a College of Intermediate Studies graduation ceremony",
      ar: "د. أبو زعيتر يتسلّم درع شكر وتقدير في حفل تخرج كلية الدراسات المتوسطة",
    },
    caption: {
      en: "Honoured at a College of Intermediate Studies ceremony",
      ar: "تكريم في حفل كلية الدراسات المتوسطة",
    },
    place: { en: "University of Palestine, Gaza, Palestine", ar: "جامعة فلسطين، غزة، فلسطين" },
    category: "event",
    approved: true,
  },
  {
    id: "graduation-2021-university-of-palestine",
    src: "/gallery/graduation-2021-university-of-palestine.jpg",
    alt: {
      en: "Dr. AbuZaiter in academic regalia on stage at the University of Palestine 2021 graduation ceremony",
      ar: "د. أبو زعيتر بالزي الأكاديمي على منصة حفل تخرج جامعة فلسطين 2021",
    },
    caption: {
      en: "8th & 9th graduation ceremony, University of Palestine",
      ar: "حفل التخرج الثامن والتاسع، جامعة فلسطين",
    },
    date: "2021",
    place: { en: "University of Palestine, Gaza, Palestine", ar: "جامعة فلسطين، غزة، فلسطين" },
    category: "event",
    approved: true,
  },
];

export const galleryCategories: Record<GalleryCategory, LocalizedString> = {
  lab: { en: "Lab", ar: "المختبر" },
  conference: { en: "Conferences", ar: "المؤتمرات" },
  university: { en: "University", ar: "الجامعة" },
  teaching: { en: "Teaching", ar: "التدريس" },
  event: { en: "Events", ar: "الفعاليات" },
  other: { en: "Other", ar: "أخرى" },
};

export const publishedPhotos = (): GalleryPhoto[] =>
  galleryPhotos
    .filter((p) => p.approved)
    .sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
