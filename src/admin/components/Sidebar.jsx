import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Image, Newspaper, SlidersHorizontal, Images,
  Megaphone, Volume2, Info, Phone, MessageSquareQuote, Users, HelpCircle,
  Download, FolderOpen, Mail, Settings, Shield, History,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/hero', label: 'Hero', icon: SlidersHorizontal },
  { to: '/admin/slider', label: 'Slider', icon: Images },
  { to: '/admin/adverts', label: 'Adverts', icon: Megaphone },
  { to: '/admin/announcements', label: 'Announcements', icon: Volume2 },
  { to: '/admin/about', label: 'About', icon: Info },
  { to: '/admin/contact', label: 'Contact', icon: Phone },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/staff', label: 'Staff', icon: Users },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/downloads', label: 'Downloads', icon: Download },
  { to: '/admin/media', label: 'Media Library', icon: FolderOpen },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/users', label: 'Users', icon: Shield },
  { to: '/admin/audit-log', label: 'Audit Log', icon: History },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
      isActive
        ? 'bg-brand-green text-white'
        : 'text-brand-pale/80 hover:bg-brand-dark/50 hover:text-brand-pale'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white font-bold text-sm">
              KF
            </div>
            <span className="text-white font-semibold text-sm">Kudimba Farms</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white font-bold text-sm mx-auto">
            KF
          </div>
        )}
        <button
          onClick={onMobileClose || onToggle}
          className="text-white/60 hover:text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={onMobileClose}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-full py-2 text-brand-pale/60 hover:text-brand-pale transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full bg-brand-dark z-30 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative w-64 h-full bg-brand-dark z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
