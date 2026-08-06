import { verifySession } from "@/lib/session";
import { getSiteContent } from "@/lib/site-content";
import ComingNextForm from "@/components/admin/ComingNextForm";

export default async function AdminComingNextPage() {
  await verifySession();
  const content = await getSiteContent("comingNext");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Coming Next</h1>
      <ComingNextForm content={content} />
    </div>
  );
}
