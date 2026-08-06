"use client";

import { useState } from "react";
import { uploadImageClient } from "@/lib/upload-client";
import { updateComingNextAction } from "@/app/admin/site-actions";
import type { ComingNextContent, ComingNextProject, ComingNextTodo } from "@/types";

function blankTodo(): ComingNextTodo {
  return { id: crypto.randomUUID(), text: "", done: false };
}

function blankProject(): ComingNextProject {
  return { id: "", name: "", image: undefined, needBehind: "", description: "", techStack: [], todos: [] };
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#0a0b0d] px-3 py-2 text-sm text-white outline-none focus:border-[#ff004f]";
const labelClass = "mb-1 block text-xs uppercase tracking-wider text-[#666]";

export default function ComingNextForm({ content }: { content: ComingNextContent }) {
  const [items, setItems] = useState<ComingNextProject[]>(content.items);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  function update<K extends keyof ComingNextProject>(index: number, field: K, value: ComingNextProject[K]) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }
  function addProject() {
    setItems((prev) => [...prev, blankProject()]);
  }
  function removeProject(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function moveProject(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addTodo(index: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, todos: [...item.todos, blankTodo()] } : item))
    );
  }
  function updateTodo(index: number, todoIndex: number, field: keyof ComingNextTodo, value: string | boolean) {
    setItems((prev) =>
      prev.map((item, i) =>
        i !== index
          ? item
          : {
              ...item,
              todos: item.todos.map((todo, ti) => (ti === todoIndex ? { ...todo, [field]: value } : todo)),
            }
      )
    );
  }
  function removeTodo(index: number, todoIndex: number) {
    setItems((prev) =>
      prev.map((item, i) => (i !== index ? item : { ...item, todos: item.todos.filter((_, ti) => ti !== todoIndex) }))
    );
  }
  function moveTodo(index: number, todoIndex: number, direction: -1 | 1) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const target = todoIndex + direction;
        if (target < 0 || target >= item.todos.length) return item;
        const todos = [...item.todos];
        [todos[todoIndex], todos[target]] = [todos[target], todos[todoIndex]];
        return { ...item, todos };
      })
    );
  }

  return (
    <form action={updateComingNextAction} className="flex max-w-2xl flex-col gap-6">
      <input type="hidden" name="items" value={JSON.stringify(items)} readOnly />
      <p className="text-sm text-[#ababab]">
        Cards shown in the &ldquo;Coming Next&rdquo; section, in this order. Leave this list empty to hide the
        section entirely. Progress is calculated automatically from checked plan steps.
      </p>

      <div className="flex flex-col gap-6">
        {items.map((item, index) => {
          const total = item.todos.length;
          const done = item.todos.filter((todo) => todo.done).length;
          const pct = total ? Math.round((done / total) * 100) : 0;

          return (
            <div key={index} className="rounded-lg border border-white/10 bg-[#141414] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#666]">Project {index + 1}</span>
                <div className="flex items-center gap-3 text-xs text-[#ababab]">
                  <button
                    type="button"
                    onClick={() => moveProject(index, -1)}
                    disabled={index === 0}
                    className="disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProject(index, 1)}
                    disabled={index === items.length - 1}
                    className="disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button type="button" onClick={() => removeProject(index)} className="text-[#ff004f]">
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className={labelClass}>Project name</label>
                  <input
                    value={item.name}
                    onChange={(e) => update(index, "name", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Card image (optional — leave blank to show the project name as text instead)
                  </label>
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="mb-2 h-32 w-full rounded-lg object-cover" />
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      disabled={uploadingIndex === index}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingIndex(index);
                        try {
                          update(index, "image", await uploadImageClient(file));
                        } catch (error) {
                          alert(error instanceof Error ? error.message : "Upload failed.");
                        } finally {
                          setUploadingIndex(null);
                        }
                      }}
                      className="text-sm text-[#ababab]"
                    />
                    {item.image && (
                      <button
                        type="button"
                        onClick={() => update(index, "image", undefined)}
                        className="shrink-0 text-xs text-[#ff004f]"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Need behind / inspiration</label>
                  <textarea
                    value={item.needBehind}
                    onChange={(e) => update(index, "needBehind", e.target.value)}
                    rows={2}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Project description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => update(index, "description", e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tech stack (comma separated)</label>
                  <input
                    value={item.techStack.join(", ")}
                    onChange={(e) =>
                      update(
                        index,
                        "techStack",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className={labelClass}>Plan (todo list)</label>
                    <span className="text-xs text-[#ababab]">{pct}% complete</span>
                  </div>
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#ff004f]" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="flex flex-col gap-2">
                    {item.todos.map((todo, todoIndex) => (
                      <div key={todo.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={todo.done}
                          onChange={(e) => updateTodo(index, todoIndex, "done", e.target.checked)}
                          className="h-4 w-4 shrink-0 accent-[#ff004f]"
                          aria-label="Step complete"
                        />
                        <input
                          value={todo.text}
                          onChange={(e) => updateTodo(index, todoIndex, "text", e.target.value)}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => moveTodo(index, todoIndex, -1)}
                          disabled={todoIndex === 0}
                          className="shrink-0 text-xs text-[#ababab] disabled:opacity-30"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTodo(index, todoIndex, 1)}
                          disabled={todoIndex === item.todos.length - 1}
                          className="shrink-0 text-xs text-[#ababab] disabled:opacity-30"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTodo(index, todoIndex)}
                          className="shrink-0 text-xs text-[#ff004f]"
                          aria-label="Remove step"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addTodo(index)}
                    className="mt-2 text-sm font-medium text-[#ff004f]"
                  >
                    + Add step
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={addProject} className="w-fit text-sm font-medium text-[#ff004f]">
        + Add project
      </button>

      <button type="submit" className="w-fit rounded-lg bg-[#ff004f] px-6 py-3 text-sm font-medium text-white">
        Save
      </button>
    </form>
  );
}
