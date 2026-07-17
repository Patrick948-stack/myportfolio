import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0b0d] px-6 text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-2xl font-semibold">Personal Writing admin</h1>
        <LoginForm />
      </div>
    </main>
  );
}
