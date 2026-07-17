import { verifySession } from "@/lib/session";
import { getSiteContent } from "@/lib/site-content";
import PortfolioForm from "@/components/admin/PortfolioForm";

export default async function AdminPortfolioPage() {
  await verifySession();
  const content = await getSiteContent("portfolio");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Portfolio</h1>
      <PortfolioForm content={content} />
    </div>
  );
}
