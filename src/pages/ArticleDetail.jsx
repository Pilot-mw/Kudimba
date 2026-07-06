import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "lucide-react";
import api from "../api";

function renderContent(html) {
  if (!html) return "";
  const tag = (level, text) => `<h${level}>${text}</h${level}>`;
  return html
    .replace(/(^|>)### (.+?)(?=<|$)/gm, (_, before, text) => before + tag(3, text))
    .replace(/(^|>)## (.+?)(?=<|$)/gm, (_, before, text) => before + tag(2, text))
    .replace(/(^|>)# (.+?)(?=<|$)/gm, (_, before, text) => before + tag(1, text));
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("news/", { params: { slug, status: "published" } })
      .then((res) => {
        const data = res.data.results ?? res.data;
        setArticle(Array.isArray(data) ? data[0] : data);
      })
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const contentHtml = useMemo(() => renderContent(article?.content), [article?.content]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20">
        <p className="text-lg text-brand-gray">Article not found.</p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 font-semibold text-brand-dark underline underline-offset-4 decoration-brand-orange transition-colors hover:text-brand-orange"
        >
          <ArrowLeft size={16} /> Back to News
        </Link>
      </div>
    );
  }

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-MW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-brand-pale pt-24">
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <Link
          to="/news"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-gray transition-colors hover:text-brand-dark"
        >
          <ArrowLeft size={16} /> Back to News
        </Link>

        {article.featured_image && (
          <img
            src={article.featured_image}
            alt={article.title}
            className="mb-8 w-full rounded-xl object-cover shadow-md"
          />
        )}

        <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {article.author_name && (
            <span className="flex items-center gap-1">
              <User size={16} />
              {article.author_name}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {date}
            </span>
          )}
          {article.category_names?.length > 0 && (
            <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
              {article.category_names[0]}
            </span>
          )}
        </div>

        {article.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-brand-gray/80 italic">
            {article.excerpt}
          </p>
        )}

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-a:text-brand-orange leading-relaxed text-brand-gray"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>
    </div>
  );
}
