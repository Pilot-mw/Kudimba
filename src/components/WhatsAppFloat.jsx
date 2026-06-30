import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

export default function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppLink(WHATSAPP_GREETING)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
    >
      <MessageCircle size={28} />
    </a>
  );
}
