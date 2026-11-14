import { ResearchPillar } from "./types";

export const researchPillars: ResearchPillar[] = [
  {
    id: "mems-microactuators",
    title: {
      ar: "الأنظمة الكهروميكانيكية الدقيقة والمشغلات الذكية (MEMS & SMA)",
      en: "MEMS & Shape-Memory-Alloy (SMA) Microactuators",
    },
    summary: {
      ar: "تصميم ونمذجة وتصنيع مشغلات ميكروية تعتمد على سبائك NiTi الذكية وثنائية الشكل (Bimorph) في البيئات المصغرة.",
      en: "Design, modeling, and microfabrication of smart NiTi and NiTiCu shape-memory-alloy microactuators and bimorph architectures.",
    },
    description: {
      ar: "يركز هذا المحور على استغلال الخصائص الكهروحرارية والميكانيكية لسبائك الذاكرة الشكلية (NiTi SMA) لتوليد قوى وإزاحات ميكروية دقيقة بأبعاد متناهية الصغر، مع دراسة السلوك الديناميكي والحراري للمشغلات وتطبيقاتها في الأنظمة الحيوية الدقيقة.",
      en: "Focuses on exploiting the thermomechanical phase transformation of bulk NiTi smart alloys to generate high force-to-weight micro-actuation, characterizing phase transition dynamics and hysteresis compensation for bio-microfluidic and micro-robotic deployment.",
    },
    iconName: "Cpu",
    keywords: ["MEMS", "NiTi SMA", "Microactuation", "Bimorph", "Smart Materials"],
    relatedPublicationIds: ["j-2015-thermomechanical", "j-2015-stewart-platform", "j-2016-micromanipulator", "c-2014-isms"],
  },
  {
    id: "microrobotics",
    title: {
      ar: "الروبوتات الدقيقة والمناولات متناهية الصغر (Microrobotics)",
      en: "Microrobotics & Precision Micromanipulation",
    },
    summary: {
      ar: "تطوير مناولات روبوتية دقيقة ثلاثية درجات الحرية (3-DOF) للتعامل الدقيق مع الخلايا والعينات المجهرية.",
      en: "Development of monolithic 3-DOF and parallel micromanipulators for biological cell grasping and micro-assembly.",
    },
    description: {
      ar: "يشمل تصميم مناولات روبوتية متكاملة ذات درجات حرية متعددة (Miniature Stewart Platform ومناولات Bimorph) للتحكم الدقيق في الموضع والقوة على المستوى الميكروي، مما يتيح تطبيقات متقدمة في الهندسة الطبية الحيوية وتجميع الإلكترونيات الدقيقة.",
      en: "Encompasses parallel kinematics and monolithic flexure stages (such as the Miniature Stewart Platform) engineered for multi-axis cell manipulation, precision surgical tools, and cleanroom micro-assembly tasks.",
    },
    iconName: "Bot",
    keywords: ["Micromanipulator", "Parallel Robotics", "Stewart Platform", "Micro-gripping", "3-DOF"],
    relatedPublicationIds: ["j-2016-micromanipulator", "j-2015-stewart-platform", "c-2014-mne", "c-2015-ascc"],
  },
  {
    id: "micro-positioning",
    title: {
      ar: "منصات تحديد المواقع الميكروية المتجانسة (XYθz Stages)",
      en: "Precision Monolithic Micro-Positioning Stages",
    },
    summary: {
      ar: "تصميم وهندسة منصات توجيه ميكروية أحادية الكتلة (Monolithic) بحركات مستوية وزاوية (XYθz) فائقة الدقة.",
      en: "Engineering monolithic flexure-based XYθz positioning mechanisms driven by integrated SMA actuators.",
    },
    description: {
      ar: "تطوير منصات ميكانيكية دقيقة مفرغة بآليات تفريغ الشرائح (Monolithic Flexure Mechanisms) خالية من الاحتكاك الميكانيكي، مدفوعة بأسلاك وشرائح SMA لتوفير إزاحات نانوية وميكروية دقيقة في محاور XY والدوران الزاوي θz.",
      en: "Investigates friction-free monolithic flexure hinges machined from single substrates, actuated by antagonistic SMA pairs to yield sub-micron resolution across planar axes with rotational adjustment.",
    },
    iconName: "Maximize2",
    keywords: ["XYθz Stage", "Monolithic Mechanism", "Precision Positioning", "Flexure Hinge"],
    relatedPublicationIds: ["j-2016-xy-stage", "j-2021-xy-stage"],
  },
  {
    id: "control-automation",
    title: {
      ar: "أنظمة التحكم المتقدمة والأتمتة (Control & Automation)",
      en: "Advanced Control Systems & Dynamic Automation",
    },
    summary: {
      ar: "خوارزميات التحكم التكراري (ILC) والتحكم الرقمي في الأنظمة المرنة وغير الخطية والمشغلات الذكية.",
      en: "Iterative Learning Control (ILC) algorithms and non-linear tracking for flexible manipulators and smart actuators.",
    },
    description: {
      ar: "ابتكار خوارزميات تحكم تكرارية وتكيفية للتعامل مع اللاخطية والتباطؤ المغناطيسي والحراري (Hysteresis) في سبائك الذاكرة الشكلية، وتطوير أنظمة تحكم في الأذرع الآلية المرنة وحيدة الوصلة (Single-link Flexible Manipulators).",
      en: "Focuses on robust compensation of hysteresis and thermal lag in smart material systems, incorporating Iterative Learning Control (ILC) strategies for flexible single-link robotic arms and dynamic mechatronic systems.",
    },
    iconName: "Sliders",
    keywords: ["Iterative Learning Control", "Hysteresis Compensation", "Flexible Arm", "Feedback Control"],
    relatedPublicationIds: ["j-2025-iterative-learning", "j-2014-wireless-displacement", "c-2014-isms"],
  },
  {
    id: "microdevices-biomedical",
    title: {
      ar: "الأجهزة الميكروية وتطبيقات الموائع الحيوية (Microdevices & Bio-MEMS)",
      en: "Microdevices, Thermopneumatics & Bio-Systems",
    },
    summary: {
      ar: "ميكرومكسرات لاسلكية، ومضخات ميكروية تعتمد على المطاط العازل، وأنظمة استشعار حيوية وتشخيصية.",
      en: "Passive wireless micromixers, dielectric elastomer micropumps, and bio-detection diagnostic systems.",
    },
    description: {
      ar: "تطوير أجهزة ميكروية للموائع (Microfluidics) تدار لاسلكياً بترددات الرنين دون الحاجة إلى توصيلات كهربائية مباشرة، إلى جانب مضخات ميكروية لينة وأنظمة كشف مبكر عن انقطاع التنفس عند الخدج (Apnoea of Prematurity).",
      en: "Explores RF-driven wireless passive thermopneumatic mixing for lab-on-a-chip diagnostic systems, soft dielectric elastomer micropumping, and clinical engineering systems for premature infant respiratory monitoring.",
    },
    iconName: "Activity",
    keywords: ["Wireless Micromixer", "Thermopneumatic", "Micropump", "Bio-MEMS", "Infant Apnoea"],
    relatedPublicationIds: ["j-2016-thermopneumatic-mixer", "j-2017-micropump", "j-2023-apnoea", "c-2016-mems"],
  },
  {
    id: "intelligent-mechatronics-ai",
    title: {
      ar: "الميكاترونكس الذكية والذكاء الاصطناعي التطبيقي (AI & Smart Systems)",
      en: "Applied Artificial Intelligence & Intelligent Mechatronics",
    },
    summary: {
      ar: "دمج الذكاء الاصطناعي في هندسة البرمجيات والأنظمة المدمجة والمناهج الأكاديمية الحديثة.",
      en: "Integration of modern artificial intelligence methodologies into software engineering, embedded systems, and higher education.",
    },
    description: {
      ar: "انطلاقاً من موقعه عميداً لكلية هندسة البرمجيات والذكاء الاصطناعي، يركز هذا المحور التطبيقي على بناء جسور بين الأنظمة الفيزيائية-السيبرانية (Cyber-Physical Systems) وخوارزميات الذكاء الاصطناعي، وتحديث مناهج الذكاء الاصطناعي والتعليم الهندسي المتقدم.",
      en: "Bridging physical mechatronics with intelligent software paradigms, leading curriculum innovation at the intersection of cyber-physical systems, autonomous robotics, and applied AI in engineering pedagogy.",
    },
    iconName: "Sparkles",
    keywords: ["AI Integration", "Smart Mechatronics", "Engineering Pedagogy", "Cyber-Physical Systems"],
    relatedPublicationIds: [],
  },
];
