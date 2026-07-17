"use client";

import ImageField from "@/components/admin/ImageField";
import RepeatableList from "@/components/admin/RepeatableList";
import { updateAboutAction } from "@/app/admin/site-actions";
import type { AboutContent } from "@/types";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]";

const SKILL_ICON_OPTIONS = [
  "code",
  "cubes",
  "tools",
  "cloud",
  "concepts",
  "people",
  "language",
  "certificate",
];

export default function AboutForm({ content }: { content: AboutContent }) {
  return (
    <form action={updateAboutAction} className="flex max-w-2xl flex-col gap-8">
      <ImageField name="photo" label="Photo" initialUrl={content.photo} />

      <div>
        <label htmlFor="bio" className="mb-2 block text-sm text-[#ababab]">
          Bio (leave a blank line between paragraphs)
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={content.bio.join("\n\n")}
          rows={10}
          className={inputClass}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[#666]">
          Skills
        </h2>
        <RepeatableList
          name="skills"
          addLabel="Add skill category"
          initialItems={content.skills}
          fields={[
            { name: "category", label: "Category name" },
            { name: "iconKey", label: "Icon", type: "select", options: SKILL_ICON_OPTIONS },
            { name: "items", label: "Items", type: "array" },
          ]}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[#666]">
          Experience
        </h2>
        <RepeatableList
          name="experiences"
          addLabel="Add experience"
          initialItems={content.experiences}
          fields={[
            { name: "period", label: "Period (e.g. Jan 2025 – Present)" },
            { name: "role", label: "Role" },
            { name: "org", label: "Organization" },
            { name: "description", label: "Description", type: "textarea" },
          ]}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[#666]">
          Education
        </h2>
        <RepeatableList
          name="educations"
          addLabel="Add education"
          initialItems={content.educations}
          fields={[
            { name: "year", label: "Year" },
            { name: "institution", label: "Institution" },
            { name: "location", label: "Location" },
            { name: "degree", label: "Degree" },
          ]}
        />
      </div>

      <button
        type="submit"
        className="w-fit rounded-lg bg-[#ff004f] px-6 py-3 text-sm font-medium text-white"
      >
        Save
      </button>
    </form>
  );
}
