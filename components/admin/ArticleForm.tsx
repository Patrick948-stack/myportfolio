"use client";

import { useRef, useState, useTransition } from "react";
import Editor from "@/components/admin/Editor";
import ImageField from "@/components/admin/ImageField";
import { createArticleAction, updateArticleAction, autosaveArticleAction } from "@/app/admin/actions";
import type { Article } from "@/types";

export default function ArticleForm({
  mode,
  article,
}: {
  mode: "create" | "edit";
  article?: Article;
}) {
  const [type, setType] = useState<"native" | "link">(article?.type ?? "native");
  const initialContent = article?.type === "native" ? article.contentHtml : "";
  const contentInputRef = useRef<HTMLInputElement>(null);
  const autosaveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [, startTransition] = useTransition();

  const action =
    mode === "create" ? createArticleAction : updateArticleAction.bind(null, article!.id);

  function handleContentChange(html: string) {
    if (contentInputRef.current) {
      contentInputRef.current.value = html;
    }
    if (mode === "edit" && article) {
      clearTimeout(autosaveTimeout.current);
      autosaveTimeout.current = setTimeout(() => {
        startTransition(() => {
          autosaveArticleAction(article.id, html);
        });
      }, 1500);
    }
  }

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      {mode === "create" && (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="type"
              value="native"
              checked={type === "native"}
              onChange={() => setType("native")}
            />
            Write an article
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="type"
              value="link"
              checked={type === "link"}
              onChange={() => setType("link")}
            />
            Link to an article
          </label>
        </div>
      )}
      {mode === "create" && <input type="hidden" name="type" value={type} readOnly />}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm text-[#ababab]">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={article?.title}
          required
          className="w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-2 block text-sm text-[#ababab]">
          Short description
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={article?.excerpt}
          required
          rows={2}
          className="w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]"
        />
      </div>

      <div>
        <label htmlFor="tags" className="mb-2 block text-sm text-[#ababab]">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={article?.tags.join(", ")}
          className="w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]"
        />
      </div>

      <ImageField name="coverImage" label="Cover image / thumbnail" initialUrl={article?.coverImage} />

      {type === "link" ? (
        <div>
          <label htmlFor="externalUrl" className="mb-2 block text-sm text-[#ababab]">
            Destination URL
          </label>
          <input
            id="externalUrl"
            name="externalUrl"
            type="url"
            defaultValue={article?.type === "link" ? article.externalUrl : ""}
            required
            className="w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]"
          />
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm text-[#ababab]">Article body</label>
          <Editor content={initialContent} onChange={handleContentChange} />
          <input type="hidden" name="contentHtml" ref={contentInputRef} defaultValue={initialContent} />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          name="intent"
          value="draft"
          className="rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-white"
        >
          Save draft
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="rounded-lg bg-[#ff004f] px-4 py-3 text-sm font-medium text-white"
        >
          Publish
        </button>
        {mode === "edit" && article?.status === "published" && (
          <button
            type="submit"
            name="intent"
            value="unpublish"
            className="rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-[#ababab]"
          >
            Unpublish
          </button>
        )}
      </div>
    </form>
  );
}
