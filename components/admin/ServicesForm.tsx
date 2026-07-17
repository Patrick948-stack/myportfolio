"use client";

import RepeatableList from "@/components/admin/RepeatableList";
import { updateServicesAction } from "@/app/admin/site-actions";
import type { ServicesContent } from "@/types";

const SERVICE_ICON_OPTIONS = ["flask", "code", "microchip", "rocket", "bolt", "cloud", "tools", "cubes"];

export default function ServicesForm({ content }: { content: ServicesContent }) {
  return (
    <form action={updateServicesAction} className="flex max-w-2xl flex-col gap-6">
      <RepeatableList
        name="items"
        addLabel="Add service"
        initialItems={content.items}
        fields={[
          { name: "iconKey", label: "Icon", type: "select", options: SERVICE_ICON_OPTIONS },
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "extra", label: "Extra note (optional)", type: "textarea" },
          { name: "stack", label: "Stack / tags", type: "array" },
          { name: "ctaLabel", label: "Button label" },
          { name: "ctaHref", label: "Button link (e.g. #contact or /blog)" },
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
