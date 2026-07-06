import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import axios from "axios";

const api = axios.create({ baseURL: "/api/v1/" });

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("announcements/")
      .then((res) => setAnnouncements(res.data.results ?? res.data))
      .catch(() => setAnnouncements([]))
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
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">Announcements</h1>
          <p className="mt-2 text-brand-gray">
            Latest announcements and notices from Kudimba Farms.
          </p>

          {announcements.length === 0 ? (
            <div className="mt-16 text-center text-brand-gray">
              <p className="text-lg">No announcements at this time.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {announcements.map((a) => {
                const date = a.created_at
                  ? new Date(a.created_at).toLocaleDateString("en-MW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "";
                return (
                  <div
                    key={a.id}
                    className="overflow-hidden rounded-xl bg-white shadow-md"
                  >
                    {a.background_image && (
                      <img
                        src={a.background_image}
                        alt={a.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-brand-dark">{a.title}</h2>
                      {date && (
                        <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={14} />
                          {date}
                        </span>
                      )}
                      <div
                        className="mt-4 leading-relaxed text-brand-gray"
                        dangerouslySetInnerHTML={{ __html: a.content }}
                      />
                      {a.link_text && a.link_url && (
                        <a
                          href={a.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-orange transition-colors hover:text-brand-dark"
                        >
                          {a.link_text} <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
