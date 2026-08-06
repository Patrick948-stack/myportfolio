export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  href: string;
}

export interface ResearchPaper {
  id: string;
  iconKey: string;
  tag: string;
  title: string;
  description: string;
  href: string;
}

export interface SkillCategory {
  category: string;
  iconKey: string;
  items: string[];
}

export interface Experience {
  period: string;
  role: string;
  org: string;
  description: string;
}

export interface Education {
  year: string;
  institution: string;
  location: string;
  degree: string;
}

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  coverImage?: string;
  published?: boolean;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

export type ArticleStatus = "draft" | "published";

interface ArticleBase {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface NativeArticle extends ArticleBase {
  type: "native";
  slug: string;
  contentHtml: string;
}

export interface LinkArticle extends ArticleBase {
  type: "link";
  externalUrl: string;
}

export type Article = NativeArticle | LinkArticle;

export type ArticleInput =
  | (Omit<NativeArticle, "id" | "createdAt" | "updatedAt" | "publishedAt" | "status" | "slug"> & {
      status?: ArticleStatus;
    })
  | (Omit<LinkArticle, "id" | "createdAt" | "updatedAt" | "publishedAt" | "status"> & {
      status?: ArticleStatus;
    });

// A unified shape the public "Personal Writing" list renders, whether the
// item came from a legacy static MDX file or the new DB-backed articles table.
export type WritingItem =
  | { source: "legacy"; post: PostMeta }
  | { source: "db"; article: Article };

// --- Site content (Hero/About/Services/Portfolio/Contact) ---
// One JSONB row per section in the `site_content` table — see lib/site-content.ts.

export interface HeroContent {
  titles: string[];
  headline: string;
  subtitle: string;
  backgroundImage?: string;
}

export interface AboutContent {
  photo?: string;
  bio: string[];
  skills: SkillCategory[];
  experiences: Experience[];
  educations: Education[];
}

export interface ServiceItem {
  iconKey: string;
  title: string;
  description: string;
  extra?: string;
  stack?: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface ServicesContent {
  items: ServiceItem[];
}

export interface PortfolioContent {
  items: Project[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  social: SocialLink[];
}

export interface WritingSectionContent {
  title: string;
  subtitle: string;
}

export interface ComingNextTodo {
  id: string;
  text: string;
  done: boolean;
}

export interface ComingNextProject {
  id: string;
  name: string;
  image?: string;
  needBehind: string;
  description: string;
  techStack: string[];
  todos: ComingNextTodo[];
}

export interface ComingNextContent {
  items: ComingNextProject[];
}

export interface SiteContentMap {
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  contact: ContactContent;
  writing: WritingSectionContent;
  comingNext: ComingNextContent;
}

export type SiteContentKey = keyof SiteContentMap;

