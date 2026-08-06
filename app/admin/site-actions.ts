"use server";

import { updateSiteContent } from "@/lib/site-content";
import type {
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
  WritingSectionContent,
  Project,
  ComingNextProject,
} from "@/types";

function parseJsonArray<T>(formData: FormData, name: string): T[] {
  const raw = formData.get(name);
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function splitCommaList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function updateHeroAction(formData: FormData): Promise<void> {
  const content: HeroContent = {
    titles: splitCommaList(formData.get("titles")),
    headline: String(formData.get("headline") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    backgroundImage: String(formData.get("backgroundImage") ?? "") || undefined,
  };
  await updateSiteContent("hero", content);
}

export async function updateAboutAction(formData: FormData): Promise<void> {
  const content: AboutContent = {
    photo: String(formData.get("photo") ?? "") || undefined,
    bio: String(formData.get("bio") ?? "")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    skills: parseJsonArray(formData, "skills"),
    experiences: parseJsonArray(formData, "experiences"),
    educations: parseJsonArray(formData, "educations"),
  };
  await updateSiteContent("about", content);
}

export async function updateServicesAction(formData: FormData): Promise<void> {
  const content: ServicesContent = {
    items: parseJsonArray(formData, "items"),
  };
  await updateSiteContent("services", content);
}

export async function updatePortfolioAction(formData: FormData): Promise<void> {
  const items = parseJsonArray<Project>(formData, "items").map((item) => ({
    ...item,
    id: item.id?.trim() ? item.id : slugify(item.title) || crypto.randomUUID(),
  }));
  await updateSiteContent("portfolio", { items });
}

export async function updateContactAction(formData: FormData): Promise<void> {
  const content: ContactContent = {
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    social: parseJsonArray(formData, "social"),
  };
  await updateSiteContent("contact", content);
}

export async function updateWritingSectionAction(formData: FormData): Promise<void> {
  const content: WritingSectionContent = {
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
  };
  await updateSiteContent("writing", content);
}

export async function updateComingNextAction(formData: FormData): Promise<void> {
  const items = parseJsonArray<ComingNextProject>(formData, "items").map((item) => ({
    ...item,
    id: item.id?.trim() ? item.id : slugify(item.name) || crypto.randomUUID(),
    todos: item.todos.map((todo) => ({
      ...todo,
      id: todo.id?.trim() ? todo.id : crypto.randomUUID(),
    })),
  }));
  await updateSiteContent("comingNext", { items });
}
