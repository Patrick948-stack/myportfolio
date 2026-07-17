import { verifySession } from "@/lib/session";
import { getSiteContent } from "@/lib/site-content";
import ContactForm from "@/components/admin/ContactForm";

export default async function AdminContactPage() {
  await verifySession();
  const content = await getSiteContent("contact");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Contact</h1>
      <ContactForm content={content} />
    </div>
  );
}
