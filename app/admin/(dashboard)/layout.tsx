import Link from "next/link";
import { logout } from "@/lib/auth-actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <Link href="/admin" className="font-semibold">
          Site admin
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm text-[#ababab] hover:text-white">
            Log out
          </button>
        </form>
      </header>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
