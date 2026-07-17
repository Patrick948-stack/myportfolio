"use client";

import RepeatableList from "@/components/admin/RepeatableList";
import { updateContactAction } from "@/app/admin/site-actions";
import type { ContactContent } from "@/types";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#141414] px-4 py-3 text-white outline-none focus:border-[#ff004f]";

export default function ContactForm({ content }: { content: ContactContent }) {
  return (
    <form action={updateContactAction} className="flex max-w-2xl flex-col gap-6">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-[#ababab]">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue={content.email} className={inputClass} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm text-[#ababab]">
          Phone
        </label>
        <input id="phone" name="phone" defaultValue={content.phone} className={inputClass} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[#666]">
          Social links
        </h2>
        <RepeatableList
          name="social"
          addLabel="Add social link"
          initialItems={content.social}
          fields={[
            { name: "label", label: "Platform (e.g. linkedin, github)" },
            { name: "href", label: "URL" },
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
