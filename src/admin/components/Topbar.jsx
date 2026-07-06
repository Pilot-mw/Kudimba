import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumb from './Breadcrumb';
import { Menu, Bell, LogOut, User, ExternalLink } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden text-brand-ink hover:text-brand-green">
            <Menu className="w-6 h-6" />
          </button>
          <Breadcrumb />
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-brand-gray hover:text-brand-green rounded-lg hover:bg-gray-100 transition-colors"
            title="View site"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">View Site</span>
          </a>
          <button className="relative p-2 text-brand-gray hover:text-brand-ink rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-hot text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </div>
              <span className="hidden sm:block text-sm font-medium text-brand-ink">
                {user?.username || 'User'}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-brand-ink">{user?.username}</p>
                  <p className="text-xs text-brand-gray">{user?.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-brand-pale text-brand-green capitalize">
                    {user?.role || 'user'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
