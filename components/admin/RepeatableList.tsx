"use client";

import { useState } from "react";
import { uploadImageClient } from "@/lib/upload-client";

export interface ListFieldConfig {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "select" | "array" | "image";
  options?: string[];
}

type ListItem = Record<string, string | string[] | undefined>;

function blankItem(fields: ListFieldConfig[]): ListItem {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.type === "array" ? [] : field.type === "select" ? field.options?.[0] ?? "" : "",
    ])
  );
}

function ImageValue({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  return (
    <div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
      )}
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={uploading}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            onChange(await uploadImageClient(file));
          } catch (error) {
            alert(error instanceof Error ? error.message : "Upload failed.");
          } finally {
            setUploading(false);
          }
        }}
        className="text-sm text-[#ababab]"
      />
    </div>
  );
}

export default function RepeatableList({
  name,
  fields,
  initialItems,
  addLabel = "Add item",
}: {
  name: string;
  fields: ListFieldConfig[];
  // Callers pass typed domain arrays (Experience[], Project[], ...) — plain
  // interfaces don't have index signatures, so TS won't structurally match
  // them against a Record-shaped prop. Accept unknown[] and treat items as
  // generic field bags internally instead.
  initialItems: readonly unknown[];
  addLabel?: string;
}) {
  const [items, setItems] = useState<ListItem[]>(initialItems as ListItem[]);

  function update(index: number, fieldName: string, value: string | string[]) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [fieldName]: value } : item)));
  }
  function addItem() {
    setItems((prev) => [...prev, blankItem(fields)]);
  }
  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#0a0b0d] px-3 py-2 text-sm text-white outline-none focus:border-[#ff004f]";

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(items)} readOnly />

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-white/10 bg-[#141414] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#666]">
                Item {index + 1}
              </span>
              <div className="flex items-center gap-3 text-xs text-[#ababab]">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-[#ff004f]"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {fields.map((field) => {
                const rawValue = item[field.name];
                const fieldId = `${name}-${index}-${field.name}`;

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={fieldId}
                      className="mb-1 block text-xs uppercase tracking-wider text-[#666]"
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={fieldId}
                        value={(rawValue as string) ?? ""}
                        onChange={(e) => update(index, field.name, e.target.value)}
                        rows={3}
                        className={inputClass}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={fieldId}
                        value={(rawValue as string) ?? field.options?.[0] ?? ""}
                        onChange={(e) => update(index, field.name, e.target.value)}
                        className={inputClass}
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "array" ? (
                      <input
                        id={fieldId}
                        value={Array.isArray(rawValue) ? rawValue.join(", ") : ""}
                        onChange={(e) =>
                          update(
                            index,
                            field.name,
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="Comma separated"
                        className={inputClass}
                      />
                    ) : field.type === "image" ? (
                      <ImageValue
                        id={fieldId}
                        value={(rawValue as string) ?? ""}
                        onChange={(url) => update(index, field.name, url)}
                      />
                    ) : (
                      <input
                        id={fieldId}
                        type={field.type === "url" ? "url" : "text"}
                        value={(rawValue as string) ?? ""}
                        onChange={(e) => update(index, field.name, e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 text-sm font-medium text-[#ff004f]"
      >
        + {addLabel}
      </button>
    </div>
  );
}
