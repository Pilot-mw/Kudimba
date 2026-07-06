import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Recycle, Truck, HeartHandshake, ArrowRight, MessageCircle, Calendar, User } from "lucide-react";
import axios from "axios";
import Hero from "../components/Hero";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import ValueCard from "../components/ValueCard";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

const api = axios.create({ baseURL: "/api/v1/" });

const FEATURED_PRODUCTS = [
  {
    name: "Hot Sauce (Peri-Peri & Kambuzi)",
    description: "A fiery blend for those who love intense heat.",
    heat: "Extra Hot",
    image: "/images/products/hot-sauce.jpg",
  },
  {
    name: "Spicy Pepper Sauce (Cayenne & Jalapeño)",
    description: "The perfect balance of flavour and medium heat for everyday cooking.",
    heat: "Medium",
    image: "/images/products/spicy-sauce.jpg",
  },
  {
    name: "Sweet Pepper Sauce (Red Bell Pepper)",
    description: "A mild, tangy-sweet sauce with no heat — ideal for marinades and dips.",
    image: "/images/products/sweet-sauce.jpg",
  },
  {
    name: "Kambuzi Special",
    description: "A tribute to Malawi — pure Kambuzi sauce with an authentic, distinctive kick.",
    heat: "Mild",
    image: "/images/products/kambuzi-special.jpg",
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "From field to bottle — we control every step for consistent, superior products.",
  },
  {
    icon: Recycle,
    title: "Sustainable Practices",
    description: "Crop rotation, organic composting, and eco-friendly farming methods.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    description: "Year-round availability with scalable capacity for retail and wholesale orders.",
  },
  {
    icon: HeartHandshake,
    title: "Partnership Focus",
    description: "We work closely with restaurants, hotels, and retailers to meet your needs.",
  },
];

const MARKETS = [
  "Households",
  "Restaurants & Hotels",
  "Retailers & Supermarkets",
  "Wholesalers & Food Processors",
];

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get("news/", { params: { status: "published", page_size: 3 } })
      .then((res) => setArticles(res.data.results ?? res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.get("announcements/")
      .then((res) => setAnnouncements(res.data.results ?? res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Hero />

      {announcements.length > 0 && (
        <div className="overflow-hidden bg-brand-orange py-3">
          <div className="animate-scroll flex gap-12 whitespace-nowrap text-sm font-medium text-white">
            {announcements.map((a) => (
              <span key={a.id}>
                {a.title}
                {a.link_text && a.link_url && (
                  <a
                    href={a.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 font-semibold underline underline-offset-2 transition-colors hover:text-brand-dark"
                  >
                    {a.link_text}
                  </a>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-brand-gray">
            Kudimba Farms is a premier agricultural enterprise based in{" "}
            <strong className="text-brand-dark">Area 47, Lilongwe, Malawi</strong>, dedicated to
            the specialised cultivation and processing of high-quality pepper products — from fiery
            Peri-Peri to mild, fruity Local Kambuzi.
          </p>
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Featured Products</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-semibold text-brand-dark underline underline-offset-4 decoration-brand-orange transition-colors hover:text-brand-orange"
            >
              View Full Portfolio <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>News &amp; Updates</SectionHeading>
          <p className="mt-4 text-center text-brand-gray">
            Latest news and articles from Kudimba Farms.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  {article.featured_image && (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-brand-dark">
                      {article.title}
                    </h3>
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
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {articles.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 font-semibold text-brand-dark underline underline-offset-4 decoration-brand-orange transition-colors hover:text-brand-orange"
              >
                View All Articles <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading>Why Partner With Us</SectionHeading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => (
              <ValueCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-dark px-4 py-16 md:py-20">
        <img src="/Hero 3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="relative mx-auto max-w-7xl text-center">
          <SectionHeading light>Markets We Serve</SectionHeading>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {MARKETS.map((m) => (
              <span
                key={m}
                className="rounded-full border border-brand-orange px-5 py-2 text-sm font-medium text-brand-orange"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-pale px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-brand-dark md:text-3xl">
            Ready to order or enquire?
          </h2>
          <p className="mt-3 text-brand-gray">
            Tap the button below to reach us directly on WhatsApp.
          </p>
          <a
            href={buildWhatsAppLink(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
          >
            <MessageCircle size={20} />
            Start a Conversation
          </a>
        </div>
      </section>
    </>
  );
}
