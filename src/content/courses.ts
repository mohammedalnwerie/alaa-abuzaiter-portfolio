import { CourseTaught, LocalizedString } from "./types";

export const courseCategories = [
  { id: "mechatronics-robotics", name: { ar: "الميكاترونكس والروبوتات", en: "Mechatronics & Robotics" } },
  { id: "systems-control", name: { ar: "الأنظمة والتحكم ومعالجة الإشارات", en: "Systems, Control & Signal Processing" } },
  { id: "circuits-electronics", name: { ar: "الدوائر والأنظمة الإلكترونية", en: "Circuits & Electronics" } },
  { id: "digital-computing", name: { ar: "الأنظمة الرقمية والمعالجات المدمجة", en: "Digital Systems & Microprocessors" } },
  { id: "modeling-mechanical", name: { ar: "النمذجة والتصميم الهندسي بمساعدة الحاسوب", en: "Modeling, Mechanics & Computer-Aided Engineering" } },
  { id: "artificial-intelligence", name: { ar: "الذكاء الاصطناعي والتقنيات الذكية", en: "Artificial Intelligence" } },
];

// Exact 15 unique courses from Page 4 of CV 2026 (duplicate CAE entry eliminated)
// Preserving original naming exactly as written in the CV
export const coursesData: CourseTaught[] = [
  // 1. Mechatronics & Robotics
  {
    id: "course-mechatronics-design",
    titleOriginal: "Mechatronics design.",
    titleAr: "تصميم الميكاترونكس",
    category: courseCategories[0],
  },
  {
    id: "course-robots",
    titleOriginal: "Robots.",
    titleAr: "الروبوتات",
    category: courseCategories[0],
  },

  // 2. Systems, Control & Signal Processing
  {
    id: "course-automation-control",
    titleOriginal: "Automation and control system.",
    titleAr: "أنظمة الأتمتة والتحكم",
    category: courseCategories[1],
  },
  {
    id: "course-signal-processing",
    titleOriginal: "Signal processing and system.",
    titleAr: "أنظمة ومعالجة الإشارات",
    category: courseCategories[1],
  },
  {
    id: "course-dsp",
    titleOriginal: "Digital signal processing (DSP)",
    titleAr: "معالجة الإشارات الرقمية (DSP)",
    category: courseCategories[1],
  },

  // 3. Circuits & Electronics
  {
    id: "course-electrical-circuits",
    titleOriginal: "Electrical circuits (1) & (2).",
    titleAr: "الدوائر الكهربائية (1) و (2)",
    category: courseCategories[2],
  },
  {
    id: "course-electronics",
    titleOriginal: "Electronics (1) & (2).",
    titleAr: "الإلكترونيات (1) و (2)",
    category: courseCategories[2],
  },

  // 4. Digital Systems & Microprocessors
  {
    id: "course-digital-logic",
    titleOriginal: "Digital Logic Design",
    titleAr: "تصميم المنطق الرقمي",
    category: courseCategories[3],
  },
  {
    id: "course-digital-logic-lab",
    titleOriginal: "Digital Logic Design Lab",
    titleAr: "مختبر تصميم المنطق الرقمي",
    category: courseCategories[3],
  },
  {
    id: "course-microcontrollers",
    titleOriginal: "Microcontroller and microprocessors.",
    titleAr: "المتحكمات الدقيقة والمعالجات الدقيقة",
    category: courseCategories[3],
  },

  // 5. Modeling, Mechanics & Computer-Aided Engineering
  {
    id: "course-modeling-simulation",
    titleOriginal: "Modeling and simulation.",
    titleAr: "النمذجة والمحاكاة",
    category: courseCategories[4],
  },
  {
    id: "course-cae",
    titleOriginal: "Computer Aided Engineering (CAE)",
    titleAr: "الهندسة بمساعدة الحاسوب (CAE)",
    category: courseCategories[4],
  },
  {
    id: "course-machine-components",
    titleOriginal: "Mechanical Machine Components",
    titleAr: "عناصر الآلات الميكانيكية",
    category: courseCategories[4],
  },
  {
    id: "course-image-processing",
    titleOriginal: "Image processing.",
    titleAr: "معالجة الصور",
    category: courseCategories[4],
  },

  // 6. Artificial Intelligence
  {
    id: "course-ai",
    titleOriginal: "Artificial intelligent.",
    titleAr: "الذكاء الاصطناعي",
    category: courseCategories[5],
  },
];

// General Technical Skills & Software Tools from Page 4 of CV 2026
// (Kept in general section, not tied to specific courses)
export const technicalSkillsAndTools = {
  softwareTools: [
    "MATLAB",
    "COMSOL Multiphysics",
    "SolidWorks",
    "AutoCAD",
    "SPSS",
    "ANSYS",
    "Proteus",
    "LabVIEW",
    "ICDL",
  ],
  technicalSpecializations: [
    {
      ar: "تصنيع أجهزة الأنظمة الكهروميكانيكية الدقيقة (MEMS fabrication)",
      en: "MEMS fabrication",
    },
    {
      ar: "مشغلات سبائك الذاكرة الشكلية الدقيقة (SMA microactuators)",
      en: "SMA microactuators",
    },
    {
      ar: "برمجة المتحكمات والأنظمة المدمجة (Microcontroller programming)",
      en: "Microcontroller programming",
    },
    {
      ar: "الهندسة والتصميم بمساعدة الحاسوب (CAD / CAE)",
      en: "Computer-Aided Design & Engineering (CAD/CAE)",
    },
    {
      ar: "التشغيل الميكروي بآلات التحكم الرقمي (CNC machining)",
      en: "CNC machining",
    },
  ],
};
