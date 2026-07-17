"use client";

import RepeatableList from "@/components/admin/RepeatableList";
import { updatePortfolioAction } from "@/app/admin/site-actions";
import type { PortfolioContent } from "@/types";

export default function PortfolioForm({ content }: { content: PortfolioContent }) {
  return (
    <form action={updatePortfolioAction} className="flex max-w-2xl flex-col gap-6">
      <RepeatableList
        name="items"
        addLabel="Add project"
        initialItems={content.items}
        fields={[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "image", label: "Thumbnail image", type: "image" },
          { name: "href", label: "Link (GitHub, live site, or # if none)" },
        ]}
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
