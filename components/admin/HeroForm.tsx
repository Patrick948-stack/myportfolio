"use client";

import ImageField from "@/components/admin/ImageField";
import { updateHeroAction } from "@/app/admin/site-actions";
import type { HeroContent } from "@/types";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]";

export default function HeroForm({ content }: { content: HeroContent }) {
  return (
    <form action={updateHeroAction} className="flex max-w-2xl flex-col gap-6">
      <div>
        <label htmlFor="titles" className="mb-2 block text-sm text-[#ababab]">
          Rotating titles (comma separated)
        </label>
        <input
          id="titles"
          name="titles"
          defaultValue={content.titles.join(", ")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="headline" className="mb-2 block text-sm text-[#ababab]">
          Headline
        </label>
        <textarea
          id="headline"
          name="headline"
          defaultValue={content.headline}
          rows={3}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="mb-2 block text-sm text-[#ababab]">
          Subtitle
        </label>
        <textarea
          id="subtitle"
          name="subtitle"
          defaultValue={content.subtitle}
          rows={4}
          required
          className={inputClass}
        />
      </div>

      <ImageField
        name="backgroundImage"
        label="Background image (optional — leave blank to keep the default)"
        initialUrl={content.backgroundImage}
      />

      <button
        type="submit"
        className="w-fit rounded-lg bg-[#ff004f] px-6 py-3 text-sm font-medium text-white"
      >
        Save
      </button>
    </form>
  );
}
