import { Link } from "react-router-dom";
import { MessageCircle, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/quality", label: "Quality & Sustainability" },
  { to: "/contact", label: "Contact / Order" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <img src="/logo.png" alt="" className="h-8 w-8 rounded object-contain bg-white p-0.5" />
            KUDIMBA FARMS
          </div>
          <p className="mt-2 text-sm text-brand-orange italic">"We grow, you eat."</p>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            Specialists in Cayenne, Jalapeño, Local Kambuzi & Peri-Peri pepper sauces and powders.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-brand-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold uppercase tracking-wider text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-orange" />
              Area 47, Lilongwe, Malawi
            </li>
              <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-brand-orange" />
              <div className="text-sm text-gray-300">
                <p>+265 999 941 540</p>
                <p className="text-gray-400">+265 885 010 149</p>
              </div>
            </li>
            <li>
              <a
                href={buildWhatsAppLink(WHATSAPP_GREETING)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 transition-colors hover:text-green-300"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/kudimbafarms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 transition-colors hover:text-brand-orange"
              >
                <ExternalLink size={16} />
                facebook.com/kudimbafarms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Kudimba Farms. All rights reserved.
      </div>
    </footer>
  );
}
