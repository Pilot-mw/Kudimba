import { MessageCircle, Flame } from "lucide-react";
import { openWhatsApp, productOrderMessage } from "../utils/whatsapp";

const HEAT_COLORS = {
  Mild: { bg: "bg-brand-green", text: "text-white" },
  Medium: { bg: "bg-brand-orange", text: "text-white" },
  Hot: { bg: "bg-brand-hot", text: "text-white" },
  "Extra Hot": { bg: "bg-brand-extrahot", text: "text-white" },
};

export default function ProductCard({ name, description, heat, image }) {
  const heatStyle = HEAT_COLORS[heat];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-pale">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-gray">
            <span className="text-4xl">🌶</span>
          </div>
        )}
        {heat && (
          <span
            className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${heatStyle.bg} ${heatStyle.text}`}
          >
            <Flame size={12} />
            {heat}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-bold text-brand-dark">{name}</h3>
        {description && (
          <p className="text-sm text-brand-gray leading-relaxed">{description}</p>
        )}
        <button
          onClick={() => openWhatsApp(productOrderMessage(name))}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
        >
          <MessageCircle size={16} />
          Order via WhatsApp
        </button>
      </div>
    </div>
  );
}
