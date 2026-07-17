"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SoundToggle from "@/components/SoundToggle";
import CommandPalette from "@/components/CommandPalette";

// The /admin panel is a separate, self-contained tool (its own header, no
// marketing nav/cursor/search) — it shouldn't inherit the public site chrome
// just because it's nested under the root layout.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <CustomCursor />
      <SoundToggle />
      <CommandPalette />
    </>
  );
}
