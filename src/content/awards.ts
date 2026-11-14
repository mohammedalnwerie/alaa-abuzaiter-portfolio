import { AwardItem, ProfessionalWorkshop } from "./types";

export const awardsData: AwardItem[] = [
  {
    id: "award-best-paper-2021",
    title: {
      ar: "جائزة أفضل بحث علمي (Best Paper Award)",
      en: "Best Paper Award",
    },
    organization: {
      ar: "المؤتمر الدولي للإلكترونيات والأجهزة والقياسات، ماليزيا",
      en: "International Conference on Electronics, Instrumentation & Devices, Malaysia",
    },
    year: 2021,
    location: {
      ar: "ماليزيا",
      en: "Malaysia",
    },
    status: "verified",
  },
  {
    id: "award-inatex-2013",
    title: {
      ar: "الميداليتان الفضية والبرونزية (Silver & Bronze Medals)",
      en: "Silver & Bronze Medals",
    },
    organization: {
      ar: "معرض الابتكار والتقنية (INATEX Exhibition)، جامعة تكنولوجي ماليزيا",
      en: "INATEX Exhibition, Universiti Teknologi Malaysia (UTM)",
    },
    year: 2013,
    location: {
      ar: "جوهور، ماليزيا",
      en: "Johor, Malaysia",
    },
    status: "verified",
  },
  {
    id: "award-phd-excellence",
    title: {
      ar: "شهادة التميز الأكاديمي لأطروحة الدكتوراه (Certificate of Excellence)",
      en: "Certificate of Excellence – PhD Thesis",
    },
    organization: {
      ar: "جامعة تكنولوجي ماليزيا (UTM)",
      en: "Universiti Teknologi Malaysia (UTM)",
    },
    // The CV gives no date for this certificate; 2016 is inferred from the PhD period (2013–2016).
    year: 2016,
    yearInferred: true,
    location: {
      ar: "ماليزيا",
      en: "Malaysia",
    },
    status: "verified",
  },
];

export const yearInferredNote = {
  en: "* Year inferred from the PhD period; the CV gives no date.",
  ar: "* السنة مستنتجة من فترة الدكتوراه؛ لا تذكر السيرة الذاتية تاريخاً.",
};

export const workshopsData: ProfessionalWorkshop[] = [
  {
    id: "ws-ai-education-2025",
    title: {
      ar: "الذكاء الاصطناعي في التعليم – تطبيقات متقدمة (ورشة عمل)",
      en: "Artificial Intelligence in Education – Advanced Applications (Workshop)",
    },
    // The CV names no organizer for this workshop.
    year: "2025",
  },
  {
    id: "ws-modern-teaching",
    title: {
      ar: "طرائق التدريس الحديثة والاستراتيجيات التربوية",
      en: "Modern Teaching Methods and Pedagogical Strategies",
    },
    organizer: {
      ar: "جامعة فلسطين (UP)",
      en: "University of Palestine (UP)",
    },
  },
  {
    id: "ws-mems-fabrication",
    title: {
      ar: "ورشة تصنيع أجهزة الأنظمة الكهروميكانيكية الدقيقة (MEMS Device Fabrication)",
      en: "MEMS Device Fabrication Workshop",
    },
    organizer: {
      ar: "جامعة تكنولوجي ماليزيا (UTM)",
      en: "Universiti Teknologi Malaysia (UTM), Malaysia",
    },
  },
  {
    id: "ws-cnc-micromachining",
    title: {
      ar: "تدريب مراكز آلات التشغيل الميكروي (CNC Micro-Machine Center)",
      en: "CNC Micro-Machine Center Training",
    },
    organizer: {
      ar: "MicroTools، ماليزيا",
      en: "MicroTools, Malaysia",
    },
  },
  {
    id: "ws-project-management",
    title: {
      ar: "إدارة المشاريع والتخطيط الاستراتيجي",
      en: "Project Management & Strategic Planning",
    },
    organizer: {
      ar: "PNGO، غزة، فلسطين",
      en: "PNGO, Gaza, Palestine",
    },
  },
];
