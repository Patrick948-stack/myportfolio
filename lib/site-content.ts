import "server-only";
import { z } from "zod";
import { query } from "@/lib/db";
import { verifySession } from "@/lib/session";
import type { SiteContentMap, SiteContentKey } from "@/types";

const skillCategorySchema = z.object({
  category: z.string(),
  iconKey: z.string(),
  items: z.array(z.string()),
});
const experienceSchema = z.object({
  period: z.string(),
  role: z.string(),
  org: z.string(),
  description: z.string(),
});
const educationSchema = z.object({
  year: z.string(),
  institution: z.string(),
  location: z.string(),
  degree: z.string(),
});
const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  href: z.string(),
});
const serviceItemSchema = z.object({
  iconKey: z.string(),
  title: z.string(),
  description: z.string(),
  extra: z.string().optional(),
  stack: z.array(z.string()).optional(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});
const socialLinkSchema = z.object({ label: z.string(), href: z.string() });
const comingNextTodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
});
const comingNextProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  needBehind: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  todos: z.array(comingNextTodoSchema),
});

const schemas: { [K in SiteContentKey]: z.ZodType<SiteContentMap[K]> } = {
  hero: z.object({
    titles: z.array(z.string()),
    headline: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().optional(),
  }),
  about: z.object({
    photo: z.string().optional(),
    bio: z.array(z.string()),
    skills: z.array(skillCategorySchema),
    experiences: z.array(experienceSchema),
    educations: z.array(educationSchema),
  }),
  services: z.object({ items: z.array(serviceItemSchema) }),
  portfolio: z.object({ items: z.array(projectSchema) }),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    social: z.array(socialLinkSchema),
  }),
  writing: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  comingNext: z.object({ items: z.array(comingNextProjectSchema) }),
};

interface SiteContentRow<K extends SiteContentKey> {
  key: K;
  data: SiteContentMap[K];
}

// Safety net if a section hasn't been seeded yet (e.g. migration ran but
// `npm run db:seed-content` hasn't) — an empty-but-valid shape rather than
// null, so pages and admin forms never have to special-case "no row yet".
const EMPTY_DEFAULTS: SiteContentMap = {
  hero: { titles: [], headline: "", subtitle: "" },
  about: { bio: [], skills: [], experiences: [], educations: [] },
  services: { items: [] },
  portfolio: { items: [] },
  contact: { email: "", phone: "", social: [] },
  writing: { title: "Latest Writing", subtitle: "" },
  comingNext: { items: [] },
};

export async function getSiteContent<K extends SiteContentKey>(
  key: K
): Promise<SiteContentMap[K]> {
  const rows = await query<SiteContentRow<K>>(
    `select key, data from site_content where key = $1`,
    [key]
  );
  return rows[0]?.data ?? EMPTY_DEFAULTS[key];
}

export async function updateSiteContent<K extends SiteContentKey>(
  key: K,
  data: SiteContentMap[K]
): Promise<SiteContentMap[K]> {
  await verifySession();

  const parsed = schemas[key].parse(data);

  const rows = await query<SiteContentRow<K>>(
    `insert into site_content (key, data, updated_at)
     values ($1, $2, now())
     on conflict (key) do update set data = excluded.data, updated_at = now()
     returning key, data`,
    [key, JSON.stringify(parsed)]
  );
  return rows[0].data;
}
