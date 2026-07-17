import { verifySession } from "@/lib/session";
import { getSiteContent } from "@/lib/site-content";
import HeroForm from "@/components/admin/HeroForm";

export default async function AdminHeroPage() {
  await verifySession();
  const content = await getSiteContent("hero");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Hero</h1>
      <HeroForm content={content} />
    </div>
  );
}
