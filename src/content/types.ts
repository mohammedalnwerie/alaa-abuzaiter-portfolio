export type Locale = "ar" | "en";

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface ProfileData {
  name: LocalizedString;
  fullNameFormal: LocalizedString;
  academicRank: LocalizedString;
  administrativeRole: LocalizedString;
  affiliationFaculty: LocalizedString;
  affiliationUniversity: LocalizedString;
  location: LocalizedString;
  email: string;
  emailStatus: "verified" | "needs-confirmation";
  /** approved portrait in public/, or omit to show the awaiting-photo placeholder */
  photo?: string;
  photoAlt?: LocalizedString;
  bioShort: LocalizedString;
  bioFull: LocalizedString[];
  languages: {
    language: LocalizedString;
    proficiency: LocalizedString;
  }[];
  verifiedFacts: {
    label: LocalizedString;
    detail: LocalizedString;
  }[];
}

export interface ResearchPillar {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  iconName: string;
  keywords: string[];
  relatedPublicationIds: string[];
}

export type PublicationType = "journal" | "conference" | "book-chapter";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: PublicationType;
  sourceName: string; // Journal name, Conference name, or Book title
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  publisherUrl?: string;
  abstract?: LocalizedString;
  location?: string; // For conferences
  verified: boolean;
  statusNote?: LocalizedString;
  citationBibtex?: string;
  citationApa?: string;
}

export interface LeadershipRole {
  id: string;
  title: LocalizedString;
  institution: LocalizedString;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  verifiedSource: LocalizedString;
  responsibilitiesPlaceholder: LocalizedString;
  achievementsPlaceholder: LocalizedString;
}

export interface CourseTaught {
  id: string;
  titleOriginal: string; // Exact title from CV
  titleAr: string;
  category: {
    id: string;
    name: LocalizedString;
  };
  toolsAndTech?: string[];
}

export interface EducationItem {
  id: string;
  degreeOriginal: string;
  degreeAr: string;
  degreeEn: string;
  field: LocalizedString;
  institution: LocalizedString;
  location: LocalizedString;
  period: string;
  gradeNote?: LocalizedString;
}

export interface CareerItem {
  id: string;
  roleOriginal: string;
  roleAr: string;
  roleEn: string;
  institution: LocalizedString;
  period: string;
  isPartTime?: boolean;
  isCurrent?: boolean;
  notes?: LocalizedString;
}

export interface AwardItem {
  id: string;
  title: LocalizedString;
  organization: LocalizedString;
  year: number;
  /** true when the CV gives no date and `year` is inferred (shown with an asterisk) */
  yearInferred?: boolean;
  category?: LocalizedString;
  location?: LocalizedString;
  status: "verified" | "needs-certificate";
}

export interface ProfessionalWorkshop {
  id: string;
  title: LocalizedString;
  /** omitted when the CV does not name the organizer */
  organizer?: LocalizedString;
  year?: string;
}

export type GalleryCategory = "lab" | "conference" | "university" | "teaching" | "event" | "other";

export interface GalleryPhoto {
  id: string;
  /** file in public/gallery, e.g. "/gallery/2015-utm-mems-lab.jpg" */
  src: string;
  /** what the photo shows, for screen readers and when the image fails (required in both languages) */
  alt: LocalizedString;
  caption?: LocalizedString;
  /** "YYYY" or "YYYY-MM" */
  date?: string;
  place?: LocalizedString;
  category: GalleryCategory;
  credit?: string;
  /** only true after Dr. AbuZaiter approves the photo and anyone identifiable in it has consented */
  approved: boolean;
}
