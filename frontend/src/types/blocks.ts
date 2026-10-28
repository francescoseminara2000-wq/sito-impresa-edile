export type SectionType =
  | 'HERO'
  | 'STATS'
  | 'SERVICES_GRID'
  | 'PROJECTS_SHOWCASE'
  | 'TEXT_IMAGE'
  | 'BEFORE_AFTER'
  | 'FAQ'
  | 'CTA_FORM';

export interface PageSectionData {
  id: string;
  pageId: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
  content: any;
}

export interface HeroContent {
  badge?: string;
  title: string;
  highlightedWord?: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage: string;
  statsPreview?: { number: string; label: string }[];
}

export interface BeforeAfterContent {
  title: string;
  subtitle?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  projectTitle?: string;
  description?: string;
  details?: { label: string; value: string }[];
}

export interface ServiceItem {
  id?: string;
  iconName?: string;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  imageUrl?: string;
  fullDetails?: string;
}

export interface ServicesGridContent {
  tagline?: string;
  title: string;
  description?: string;
  services: ServiceItem[];
}

export interface ProjectsShowcaseContent {
  tagline?: string;
  title: string;
  description?: string;
  featuredOnly?: boolean;
}

export interface StatsContent {
  stats: {
    value: string;
    suffix?: string;
    label: string;
    sublabel?: string;
  }[];
}

export interface FaqContent {
  tagline?: string;
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export interface CtaFormContent {
  title: string;
  subtitle: string;
  servicesOptions: string[];
  budgetOptions: string[];
}
