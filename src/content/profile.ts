import { ProfileData } from "./types";

export const profileData: ProfileData = {
  name: {
    ar: "د.م. علاء أبو زعيتر",
    en: "Dr. Eng. Alaa AbuZaiter",
  },
  fullNameFormal: {
    ar: "د.م. علاء عبدالله حسن أبو زعيتر",
    en: "Dr. Eng. Alaa A. AbuZaiter",
  },
  academicRank: {
    ar: "أستاذ مساعد",
    en: "Assistant Professor",
  },
  administrativeRole: {
    ar: "عميد كلية هندسة البرمجيات والذكاء الاصطناعي",
    en: "Dean, Faculty of Software Engineering & Artificial Intelligence",
  },
  affiliationFaculty: {
    ar: "كلية هندسة البرمجيات والذكاء الاصطناعي",
    en: "Faculty of Software Engineering and Artificial Intelligence",
  },
  affiliationUniversity: {
    ar: "جامعة فلسطين",
    en: "University of Palestine",
  },
  location: {
    ar: "غزة، فلسطين",
    en: "Gaza, Palestine",
  },
  email: "a.zaiter@up.edu.ps",
  emailStatus: "verified", // approved by Dr. AbuZaiter for public contact (2026-11-09)
  // Portrait supplied and approved by Dr. AbuZaiter (2026-11-08).
  photo: "/portrait/alaa-abuzaiter.jpg",
  photoAlt: {
    ar: "صورة للدكتور المهندس علاء أبو زعيتر",
    en: "Portrait of Dr. Eng. Alaa A. AbuZaiter",
  },
  bioShort: {
    ar: "أكاديمي وباحث متخصص في الأنظمة الكهروميكانيكية الدقيقة (MEMS)، ومشغلات سبائك الذاكرة الشكلية (SMA)، والروبوتات الدقيقة، وهندسة الميكاترونكس، مع خبرة تتجاوز عشر سنوات في التعليم العالي والإدارة الأكاديمية.",
    en: "Academic leader and researcher specializing in Micro-Electro-Mechanical Systems (MEMS), Shape-Memory-Alloy (SMA) actuators, microrobotics, and mechatronics engineering, with over a decade of higher education leadership.",
  },
  bioFull: [
    {
      ar: "يشغل الدكتور المهندس علاء أبو زعيتر منصب عميد كلية هندسة البرمجيات والذكاء الاصطناعي بجامعة فلسطين، ويعمل برتبة أستاذ مساعد في الهندسة. يحمل درجة الدكتوراه في الأنظمة الكهروميكانيكية الدقيقة (MEMS) ودرجة الماجستير في هندسة الميكاترونكس والتحكم الآلي من جامعة تكنولوجي ماليزيا (UTM).",
      en: "Dr. Eng. Alaa A. AbuZaiter serves as Dean of the Faculty of Software Engineering and Artificial Intelligence at the University of Palestine, holding the academic rank of Assistant Professor. He earned his PhD in Micro-Electro-Mechanical Systems (MEMS) and his Master's degree in Mechatronics and Automatic Control from Universiti Teknologi Malaysia (UTM).",
    },
    {
      ar: "تركز أبحاثه المنشورة على المشغلات الميكروية الذكية، والمناولات الدقيقة ثلاثية الأبعاد، ومنصات تحديد المواقع فائقة الدقة (XYθz Stages)، وميكرومكسرات السوائل اللاسلكية، مع سجل علمي يتضمن 19 عملاً علمياً موثقاً (11 بحثاً في مجلات علمية محكمة، و6 أوراق في وقائع مؤتمرات دولية، وفصلين في كتب أكاديمية).",
      en: "His published scholarship focuses on smart microactuators, 3-DOF micromanipulators, monolithic micro-positioning stages (XYθz), and wireless passive thermopneumatic micromixers, comprising 19 documented scholarly works: 11 refereed journal articles, 6 conference proceedings papers, and 2 academic book chapters.",
    },
    {
      ar: "إلى جانب نشاطه البحثي والتدريسي عبر تدريس 15 مساقاً هندسياً وتقنياً أصلياً، قاد الدكتور علاء مبادرات أكاديمية متعددة خلال عمله عميداً لكلية الدراسات المتوسطة ورئيساً لأقسام الهندسة الطبية الحيوية، مساهماً في تطوير البرامج الجامعية ودمج التقنيات الذكية في المنظومة التعليمية.",
      en: "Alongside teaching 15 specialized engineering and computational courses, Dr. AbuZaiter has steered strategic initiatives as former Dean of the College of Intermediate Studies and Head of Biomedical Engineering Departments, fostering curricular advancement and the pedagogical integration of emerging technologies.",
    },
  ],
  languages: [
    {
      language: { ar: "العربية", en: "Arabic" },
      proficiency: { ar: "اللغة الأم", en: "Native" },
    },
    {
      language: { ar: "الإنجليزية", en: "English" },
      proficiency: { ar: "جيد جداً (قراءة وكتابة ومحادثة)", en: "Very Good (Reading, Writing & Conversation)" },
    },
  ],
  verifiedFacts: [
    {
      label: { ar: "الدرجة العلمية", en: "Doctoral Degree" },
      detail: { ar: "دكتوراه في MEMS – ماليزيا", en: "PhD in MEMS, UTM Malaysia" },
    },
    {
      label: { ar: "الرتبة الأكاديمية", en: "Academic Rank" },
      detail: { ar: "أستاذ مساعد", en: "Assistant Professor" },
    },
    {
      label: { ar: "المنصب الإداري", en: "Administrative Role" },
      detail: { ar: "عميد كلية هندسة البرمجيات والذكاء الاصطناعي", en: "Dean of Faculty of SE & AI" },
    },
    {
      label: { ar: "الإنتاج العلمي الموثق", en: "Scholarly Works" },
      detail: { ar: "19 عملاً علمياً (11 مجلة، 6 مؤتمرات، 2 كتب)", en: "19 Works (11 Journals, 6 Conf., 2 Chapters)" },
    },
  ],
};
