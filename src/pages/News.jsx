import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import api from "../api";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("news/", {
        params: { status: "published", page_size: 50 },
      })
      .then((res) => setArticles(res.data.results ?? res.data))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-pale pt-24">
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">News &amp; Updates</h1>
          <p className="mt-2 text-brand-gray">
            Latest news, articles, and updates from Kudimba Farms.
          </p>

          {articles.length === 0 ? (
            <div className="mt-16 text-center text-brand-gray">
              <p className="text-lg">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                const date = article.published_at
                  ? new Date(article.published_at).toLocaleDateString("en-MW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "";

                return (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}/`}
                    className="block overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-brand-dark">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="mt-2 text-sm leading-relaxed text-brand-gray line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {article.author_name && (
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {article.author_name}
                          </span>
                        )}
                        {date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {date}
                          </span>
                        )}
                        {article.category_names?.length > 0 && (
                          <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-medium text-brand-orange">
                            {article.category_names[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
