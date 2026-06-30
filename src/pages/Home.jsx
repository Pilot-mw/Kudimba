import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Recycle, Truck, HeartHandshake, ArrowRight, MessageCircle, X } from "lucide-react";
import Hero from "../components/Hero";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import ValueCard from "../components/ValueCard";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

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

const LOCATIONS = [
  {
    image: "/images/products/now-available.jpg",
    product: "Cayenne Powder 250g",
    location: "Gouji Shopping Complex, Shop A-13C, Area 49, Lilongwe",
  },
];

export default function Home() {
  const [preview, setPreview] = useState(null);

  return (
    <>
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="max-w-lg rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-brand-dark">{preview.product}</h3>
              <button onClick={() => setPreview(null)} aria-label="Close preview">
                <X size={20} className="text-brand-gray hover:text-brand-dark" />
              </button>
            </div>
            <img
              src={preview.image}
              alt={preview.product}
              className="mt-4 w-full rounded-lg object-cover"
            />
            <p className="mt-4 text-sm text-brand-gray leading-relaxed">
              {preview.location}
            </p>
          </div>
        </div>
      )}

      <Hero />

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
          <SectionHeading>Now Available</SectionHeading>
          <p className="mt-4 text-center text-brand-gray">
            Find our products at these locations across Lilongwe.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((item) => (
              <button
                key={item.product}
                onClick={() => setPreview(item)}
                className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.product}
                  className="h-20 w-20 shrink-0 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-brand-dark">{item.product}</h3>
                  <p className="mt-1 text-sm text-brand-gray leading-snug">
                    {item.location}
                  </p>
                </div>
              </button>
            ))}
          </div>
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
