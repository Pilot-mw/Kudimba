import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const labelMap = {
  dashboard: 'Dashboard',
  products: 'Products',
  gallery: 'Gallery',
  news: 'News',
  hero: 'Hero',
  slider: 'Slider',
  adverts: 'Adverts',
  announcements: 'Announcements',
  about: 'About',
  contact: 'Contact',
  testimonials: 'Testimonials',
  staff: 'Staff',
  faq: 'FAQ',
  downloads: 'Downloads',
  media: 'Media Library',
  messages: 'Messages',
  settings: 'Settings',
  users: 'Users',
  'audit-log': 'Audit Log',
  login: 'Login',
  add: 'Add',
  edit: 'Edit',
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    const isLast = i === segments.length - 1;
    return { label, path, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-sm text-brand-gray">
      <Link to="/admin/dashboard" className="hover:text-brand-green transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5" />
          {crumb.isLast ? (
            <span className="text-brand-ink font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-brand-green transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
