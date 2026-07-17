import { verifySession } from "@/lib/session";
import { getSiteContent } from "@/lib/site-content";
import AboutForm from "@/components/admin/AboutForm";

export default async function AdminAboutPage() {
  await verifySession();
  const content = await getSiteContent("about");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">About</h1>
      <AboutForm content={content} />
    </div>
  );
}
