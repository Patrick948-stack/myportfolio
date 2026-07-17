"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import { uploadImageClient } from "@/lib/upload-client";

const FONTS = [
  { label: "Default", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans", value: "Arial, sans-serif" },
  { label: "Monospace", value: "'Courier New', monospace" },
];

export default function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Write your article…" }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[300px] rounded-lg border border-white/10 bg-[#141414] px-4 py-3 focus:outline-none",
      },
    },
  });

  const handleImagePick = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !editor) return;
      try {
        const url = await uploadImageClient(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Upload failed.");
      }
    },
    [editor]
  );

  if (!editor) return null;

  const button = (
    label: string,
    isActive: boolean,
    onClick: () => void
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2.5 py-1.5 text-sm ${
        isActive ? "bg-[#ff004f] text-white" : "text-[#ababab] hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#141414] p-2">
        {button("Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
        {button("Italic", editor.isActive("italic"), () =>
          editor.chain().focus().toggleItalic().run()
        )}
        {button("Underline", editor.isActive("underline"), () =>
          editor.chain().focus().toggleUnderline().run()
        )}
        {button("H2", editor.isActive("heading", { level: 2 }), () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        )}
        {button("H3", editor.isActive("heading", { level: 3 }), () =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        )}
        {button("List", editor.isActive("bulletList"), () =>
          editor.chain().focus().toggleBulletList().run()
        )}
        {button("Numbered", editor.isActive("orderedList"), () =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        {button("Quote", editor.isActive("blockquote"), () =>
          editor.chain().focus().toggleBlockquote().run()
        )}
        {button("Link", editor.isActive("link"), () => {
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        })}
        {button("Image", false, () => fileInputRef.current?.click())}
        <select
          className="rounded bg-transparent px-2 py-1.5 text-sm text-[#ababab] outline-none"
          onChange={(event) => {
            const font = event.target.value;
            if (font) {
              editor.chain().focus().setFontFamily(font).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          defaultValue=""
        >
          {FONTS.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleImagePick}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
