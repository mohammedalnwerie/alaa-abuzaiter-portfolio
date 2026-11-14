import { EducationItem, CareerItem } from "./types";

export const educationData: EducationItem[] = [
  {
    id: "edu-phd",
    degreeOriginal: "PhD in (Micro-Electro-Mechanical Systems - MEMS)",
    degreeAr: "دكتوراه في الأنظمة الكهروميكانيكية الدقيقة (MEMS)",
    degreeEn: "PhD in Micro-Electro-Mechanical Systems (MEMS)",
    field: {
      ar: "الهندسة الكهربائية والأنظمة الكهروميكانيكية الدقيقة",
      en: "Electrical Engineering & Micro-Electro-Mechanical Systems",
    },
    institution: {
      ar: "كلية الهندسة الكهربائية، جامعة تكنولوجي ماليزيا (UTM)",
      en: "Faculty of Electrical Engineering, Universiti Teknologi Malaysia (UTM)",
    },
    location: {
      ar: "جوهور، ماليزيا",
      en: "Johor, Malaysia",
    },
    period: "2013 – 2016",
    gradeNote: {
      ar: "شهادة التميز لأطروحة الدكتوراه",
      en: "Certificate of Excellence for PhD Thesis",
    },
  },
  {
    id: "edu-msc",
    degreeOriginal: "Master Degree in Engineering (Electrical – Mechatronics & Automatic control)",
    degreeAr: "ماجستير في الهندسة (كهرباء – ميكاترونكس وتحكم آلي)",
    degreeEn: "Master Degree in Engineering (Electrical – Mechatronics & Automatic Control)",
    field: {
      ar: "هندسة الميكاترونكس والتحكم الآلي",
      en: "Mechatronics Engineering & Automatic Control",
    },
    institution: {
      ar: "جامعة تكنولوجي ماليزيا (UTM)",
      en: "Universiti Teknologi Malaysia (UTM)",
    },
    location: {
      ar: "جوهور، ماليزيا",
      en: "Johor, Malaysia",
    },
    period: "2011 – 2013",
  },
  {
    id: "edu-bsc",
    degreeOriginal: "Bachelor Degree in Mechatronics Engineering",
    degreeAr: "بكالوريوس في هندسة الميكاترونكس",
    degreeEn: "Bachelor Degree in Mechatronics Engineering",
    field: {
      ar: "هندسة الميكاترونكس",
      en: "Mechatronics Engineering",
    },
    institution: {
      ar: "جامعة الأزهر – غزة، فلسطين",
      en: "Al-Azhar University – Gaza, Palestine",
    },
    location: {
      ar: "غزة، فلسطين",
      en: "Gaza, Palestine",
    },
    period: "2005 – 2009",
    gradeNote: {
      ar: "تقدير عام جيد جداً (Very Good Average)",
      en: "Very Good Average",
    },
  },
];

export const careerData: CareerItem[] = [
  {
    id: "career-dean-se-ai",
    roleOriginal: "Dean of the Faculty of Software Engineering and Artificial Intelligence",
    roleAr: "عميد كلية هندسة البرمجيات والذكاء الاصطناعي",
    roleEn: "Dean, Faculty of Software Engineering & Artificial Intelligence",
    institution: {
      ar: "جامعة فلسطين، غزة، فلسطين",
      en: "University of Palestine, Gaza, Palestine",
    },
    period: "02/2025 – Currently",
    isCurrent: true,
  },
  {
    id: "career-ap-applied-eng",
    roleOriginal: "Assistant Professor at Faculty of Applied Engineering and Urban Planning",
    roleAr: "أستاذ مساعد بكلية الهندسة التطبيقية والتخطيط العمراني",
    roleEn: "Assistant Professor, Faculty of Applied Engineering & Urban Planning",
    institution: {
      ar: "جامعة فلسطين، غزة، فلسطين",
      en: "University of Palestine, Gaza, Palestine",
    },
    period: "11/2022 – 02/2025",
  },
  {
    id: "career-dean-intermediate",
    roleOriginal: "Dean, the College of Intermediate Studies",
    roleAr: "عميد كلية الدراسات المتوسطة",
    roleEn: "Dean, College of Intermediate Studies",
    institution: {
      ar: "جامعة فلسطين، غزة، فلسطين",
      en: "University of Palestine, Gaza, Palestine",
    },
    period: "06/2021 – 11/2022",
  },
  {
    id: "career-head-biomedical",
    roleOriginal: "Head of Departments, Biomedical Engineering",
    roleAr: "رئيس أقسام الهندسة الطبية الحيوية",
    roleEn: "Head of Departments, Biomedical Engineering",
    institution: {
      ar: "كلية الهندسة التطبيقية، جامعة فلسطين، غزة، فلسطين",
      en: "Faculty of Applied Engineering, University of Palestine, Gaza, Palestine",
    },
    period: "09/2017 – 06/2021",
  },
  {
    id: "career-parttime-azhar",
    roleOriginal: "Assistant Professor in Faculty of Engineering and Information Technology (Part time)",
    roleAr: "أستاذ مساعد غير متفرغ بكلية الهندسة وتكنولوجيا المعلومات",
    roleEn: "Assistant Professor (Part-time), Faculty of Engineering & IT",
    institution: {
      ar: "جامعة الأزهر – غزة، فلسطين",
      en: "Al-Azhar University – Gaza, Palestine",
    },
    period: "09/2018 – Now",
    isPartTime: true,
    isCurrent: true,
    notes: {
      ar: "مسجل كتعيين مستمر في السيرة الذاتية (يتطلب تأكيد استمراريته الحالية)",
      en: "Recorded with ongoing status in CV (Awaiting current confirmation)",
    },
  },
  {
    id: "career-ptc",
    roleOriginal: "Assistant Professor at Engineering Department",
    roleAr: "أستاذ مساعد بقسم الهندسة",
    roleEn: "Assistant Professor, Engineering Department",
    institution: {
      ar: "كلية فلسطين التقنية – دير البلح، فلسطين",
      en: "Palestine Technical College, Deir al-Balah, Palestine",
    },
    period: "02/2017 – 09/2017",
  },
  {
    id: "career-parttime-quds",
    roleOriginal: "Assistant Professor at Faculty of Technology and Applied Sciences (Part time)",
    roleAr: "أستاذ مساعد غير متفرغ بكلية التكنولوجيا والعلوم التطبيقية",
    roleEn: "Assistant Professor (Part-time), Faculty of Technology & Applied Sciences",
    institution: {
      ar: "جامعة القدس المفتوحة – غزة، فلسطين",
      en: "Al-Quds Open University, Gaza, Palestine",
    },
    period: "01/2017 – Now",
    isPartTime: true,
    isCurrent: true,
    notes: {
      ar: "مسجل كتعيين مستمر في السيرة الذاتية (يتطلب تأكيد استمراريته الحالية)",
      en: "Recorded with ongoing status in CV (Awaiting current confirmation)",
    },
  },
  {
    id: "career-ra-utm",
    roleOriginal: "Research Assistance in Micro-Electro-Mechanical Systems - MEMS Laboratory",
    roleAr: "مساعد باحث في مختبر الأنظمة الكهروميكانيكية الدقيقة (MEMS)",
    roleEn: "Research Assistant, MEMS Laboratory",
    institution: {
      ar: "جامعة تكنولوجي ماليزيا (UTM)",
      en: "Universiti Teknologi Malaysia (UTM)",
    },
    period: "10/2013 – 07/2016",
  },
  {
    id: "career-copymax-engineer",
    roleOriginal: "Repair engineer - Maintenance department",
    roleAr: "مهندس صيانة – قسم الصيانة الهندسية",
    roleEn: "Repair Engineer, Maintenance Department",
    institution: {
      ar: "شركة كوبي ماكس (Copy Max Company)، غزة، فلسطين",
      en: "Copy Max Company, Gaza, Palestine",
    },
    period: "07/2009 – 08/2011",
  },
  {
    id: "career-copymax-trainee",
    roleOriginal: "Repair engineer - Maintenance department (under training)",
    roleAr: "مهندس صيانة متدرب – قسم الصيانة",
    roleEn: "Repair Engineer Trainee, Maintenance Department",
    institution: {
      ar: "شركة كوبي ماكس (Copy Max Company)، غزة، فلسطين",
      en: "Copy Max Company, Gaza, Palestine",
    },
    period: "06/2008 – 09/2008",
  },
];
