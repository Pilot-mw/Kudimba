import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

const HERO_IMAGES = ["/Hero 1.jpg", "/Hero 2.jpg", "/Hero 3.jpg", "/Hero 4.jpg"];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-brand-dark">
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${
            i === index ? "opacity-80" : "opacity-0"
          }`}
        />
      ))}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pt-16">
        <img
          src="/logo.png"
          alt="Kudimba Farms"
          className="mb-6 h-20 w-20 rounded-2xl object-contain bg-white p-1 shadow-lg md:h-28 md:w-28"
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          KUDIMBA FARMS
        </h1>
        <p className="mt-2 text-xl italic text-brand-orange md:text-2xl">
          "We grow, you eat."
        </p>
        <p className="mt-4 max-w-xl text-lg text-gray-300">
          Premium Malawian pepper sauces, powders &amp; spice blends.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={buildWhatsAppLink(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
          >
            <MessageCircle size={20} />
            Order on WhatsApp
          </a>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand-orange px-6 py-3 font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
          >
            View Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
