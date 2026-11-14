import { LeadershipRole } from "./types";

export const leadershipRoles: LeadershipRole[] = [
  {
    id: "dean-se-ai",
    title: {
      ar: "عميد كلية هندسة البرمجيات والذكاء الاصطناعي",
      en: "Dean of the Faculty of Software Engineering & Artificial Intelligence",
    },
    institution: {
      ar: "جامعة فلسطين، غزة، فلسطين",
      en: "University of Palestine, Gaza, Palestine",
    },
    startDate: "02/2025",
    endDate: "Currently",
    isCurrent: true,
    verifiedSource: {
      ar: "موثق بصفحة مجلس جامعة فلسطين الرسمية والسيرة الذاتية 2026",
      en: "Verified by official University of Palestine Council records & CV 2026",
    },
    responsibilitiesPlaceholder: {
      ar: "المهام والمسؤوليات الإدارية قيد التوثيق الرسمي من الكلية والجامعة.",
      en: "Administrative responsibilities awaiting formal institutional documentation.",
    },
    achievementsPlaceholder: {
      ar: "المبادرات والإنجازات الأكاديمية قيد التوثيق والاعتماد المؤسسي.",
      en: "Academic initiatives and strategic outcomes awaiting formal documentation.",
    },
  },
  {
    id: "dean-intermediate-studies",
    title: {
      ar: "عميد كلية الدراسات المتوسطة",
      en: "Dean, College of Intermediate Studies",
    },
    institution: {
      ar: "جامعة فلسطين، غزة، فلسطين",
      en: "University of Palestine, Gaza, Palestine",
    },
    startDate: "06/2021",
    endDate: "11/2022",
    isCurrent: false,
    verifiedSource: {
      ar: "موثق في السيرة الذاتية 2026",
      en: "Verified in CV 2026",
    },
    responsibilitiesPlaceholder: {
      ar: "المهام الإدارية والإشرافية السابقة قيد التوثيق الرسمي.",
      en: "Past administrative and supervisory scope awaiting formal documentation.",
    },
    achievementsPlaceholder: {
      ar: "الإنجازات والمشاريع المعتمدة قيد التوثيق المؤسسي.",
      en: "Approved institutional milestones awaiting documentation.",
    },
  },
  {
    id: "head-biomedical-engineering",
    title: {
      ar: "رئيس أقسام الهندسة الطبية الحيوية",
      en: "Head of Departments, Biomedical Engineering",
    },
    institution: {
      ar: "كلية الهندسة التطبيقية والتخطيط العمراني، جامعة فلسطين",
      en: "Faculty of Applied Engineering and Urban Planning, University of Palestine",
    },
    startDate: "09/2017",
    endDate: "06/2021",
    isCurrent: false,
    verifiedSource: {
      ar: "موثق في السيرة الذاتية 2026",
      en: "Verified in CV 2026",
    },
    responsibilitiesPlaceholder: {
      ar: "مسؤوليات إدارة القسم والخطط الدراسية قيد التوثيق الرسمي.",
      en: "Departmental governance and curricular responsibilities awaiting formal documentation.",
    },
    achievementsPlaceholder: {
      ar: "مخرجات إدارة الأقسام قيد التوثيق الرسمي.",
      en: "Departmental milestones awaiting official documentation.",
    },
  },
];

export const academicGovernanceNote = {
  ar: "تذكر السيرة الذاتية مشاركة الدكتور في عضوية مجلس البحث العلمي والمساهمة في تطوير المناهج والبرامج الأكاديمية بالجامعة، ويتم إدراج التفاصيل والمسميات الرسمية فور اعتمادها وتوثيقها.",
  en: "The CV notes active engagement in the Scientific Research Council and contributions to developing university curricula and academic programs; formal committee designations will be published upon verified institutional documentation.",
};
