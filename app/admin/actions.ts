"use server";

import { redirect } from "next/navigation";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  setArticleStatus,
} from "@/lib/articles";
import type { ArticleInput, ArticleStatus } from "@/types";

function readTags(formData: FormData): string[] {
  const raw = formData.get("tags");
  if (typeof raw !== "string" || raw.trim().length === 0) return [];
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createArticleAction(formData: FormData): Promise<void> {
  const type = formData.get("type");
  const title = String(formData.get("title") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "") || undefined;
  const tags = readTags(formData);
  const publish = formData.get("intent") === "publish";

  const base = {
    title,
    excerpt,
    coverImage,
    tags,
    status: (publish ? "published" : "draft") as ArticleStatus,
  };

  let input: ArticleInput;
  if (type === "link") {
    input = { ...base, type: "link", externalUrl: String(formData.get("externalUrl") ?? "") };
  } else {
    input = { ...base, type: "native", contentHtml: String(formData.get("contentHtml") ?? "") };
  }

  const article = await createArticle(input);
  redirect(`/admin/writing/${article.id}/edit`);
}

export async function updateArticleAction(id: string, formData: FormData): Promise<void> {
  const title = String(formData.get("title") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "") || undefined;
  const tags = readTags(formData);
  const contentHtml = formData.has("contentHtml")
    ? String(formData.get("contentHtml"))
    : undefined;
  const externalUrl = formData.has("externalUrl")
    ? String(formData.get("externalUrl"))
    : undefined;

  await updateArticle(id, { title, excerpt, coverImage, tags, contentHtml, externalUrl });

  const intent = formData.get("intent");
  if (intent === "publish") {
    await setArticleStatus(id, "published");
  } else if (intent === "unpublish") {
    await setArticleStatus(id, "draft");
  }
}

// Debounced autosave from the client editor — saves the draft body without
// touching publish status or redirecting.
export async function autosaveArticleAction(id: string, contentHtml: string): Promise<void> {
  await updateArticle(id, { contentHtml });
}

export async function setArticleStatusAction(id: string, status: ArticleStatus): Promise<void> {
  await setArticleStatus(id, status);
}

export async function deleteArticleAction(id: string): Promise<void> {
  await deleteArticle(id);
  redirect("/admin/writing");
}
