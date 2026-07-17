import { notFound } from "next/navigation";
import { getArticleByIdAdmin } from "@/lib/articles";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Edit article</h1>
      <ArticleForm mode="edit" article={article} />
    </div>
  );
}
