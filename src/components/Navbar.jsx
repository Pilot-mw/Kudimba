import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, LogIn } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_GREETING } from "../utils/whatsapp";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/news", label: "News" },
  { to: "/announcements", label: "Announcements" },
  { to: "/quality", label: "Quality & Sustainability" },
  { to: "/contact", label: "Contact / Order" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <img src="/logo.png" alt="Kudimba Farms" className="h-8 w-8 rounded object-contain bg-white p-0.5" />
          <span className="hidden sm:inline">KUDIMBA FARMS</span>
        </Link>

        <button
          className="sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul
          className={`absolute left-0 right-0 top-full flex-col bg-brand-dark/90 backdrop-blur-sm px-4 pb-4 pt-2 text-sm sm:static sm:flex sm:flex-row sm:items-center sm:gap-1 sm:bg-transparent sm:p-0 ${
            open ? "flex" : "hidden"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block rounded px-3 py-2 transition-colors ${
                  pathname === link.to
                    ? "text-brand-orange font-semibold"
                    : "hover:text-brand-orange"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 sm:mt-0 sm:ml-2">
            <a
              href={buildWhatsAppLink(WHATSAPP_GREETING)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
            >
              <MessageCircle size={16} />
              Order on WhatsApp
            </a>
          </li>
        </ul>

        <Link
          to="/admin/login"
          className="ml-2 shrink-0 rounded p-2 transition-colors hover:text-brand-orange"
          title="Admin Login"
        >
          <LogIn size={20} />
        </Link>
      </div>
    </nav>
  );
}
