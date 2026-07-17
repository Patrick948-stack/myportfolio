"use client";

import { updateWritingSectionAction } from "@/app/admin/site-actions";
import type { WritingSectionContent } from "@/types";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]";

export default function WritingSectionForm({ content }: { content: WritingSectionContent }) {
  return (
    <form
      action={updateWritingSectionAction}
      className="mb-10 flex max-w-2xl flex-col gap-4 rounded-lg border border-white/10 bg-[#141414] p-5"
    >
      <div>
        <label htmlFor="writing-title" className="mb-2 block text-sm text-[#ababab]">
          Section title
        </label>
        <input
          id="writing-title"
          name="title"
          defaultValue={content.title}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="writing-subtitle" className="mb-2 block text-sm text-[#ababab]">
          Section subtitle
        </label>
        <input
          id="writing-subtitle"
          name="subtitle"
          defaultValue={content.subtitle}
          className={inputClass}
        />
      </div>
      <p className="text-xs text-[#666]">
        Shown above the article list on the homepage and on /blog. This heading only appears
        once you have at least one published article — it&apos;s hidden entirely otherwise.
      </p>
      <button
        type="submit"
        className="w-fit rounded-lg bg-[#ff004f] px-5 py-2.5 text-sm font-medium text-white"
      >
        Save
      </button>
    </form>
  );
}
