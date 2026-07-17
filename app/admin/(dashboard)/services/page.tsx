import { verifySession } from "@/lib/session";
import { getSiteContent } from "@/lib/site-content";
import ServicesForm from "@/components/admin/ServicesForm";

export default async function AdminServicesPage() {
  await verifySession();
  const content = await getSiteContent("services");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Services</h1>
      <ServicesForm content={content} />
    </div>
  );
}
