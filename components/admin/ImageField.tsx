"use client";

import { useState } from "react";
import { uploadImageClient } from "@/lib/upload-client";

export default function ImageField({
  name,
  label,
  initialUrl,
}: {
  name: string;
  label: string;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm text-[#ababab]">{label}</label>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mb-3 h-32 w-full rounded-lg object-cover" />
      )}
      <input type="hidden" name={name} value={url} readOnly />
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={uploading}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            setUrl(await uploadImageClient(file));
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
