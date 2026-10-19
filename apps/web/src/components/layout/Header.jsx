import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore.js';
import {
  Droplets,
  Phone,
  MessageCircle,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import Button from '@mui/material/Button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettingsStore();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Purifiers', href: '/products' },
    { label: 'Services & Repair', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar for quick contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>Helpline: {settings.phone}</span>
            </span>
            <span className="hidden md:inline-block text-slate-200">
              Hours: {settings.businessHours}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Expert</span>
              </a>
            )}
            <Link
              to="/admin"
              className="text-slate-200 hover:text-white flex items-center gap-1 transition"
            >
              <UserCheck className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 to-aqua-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                {settings.businessName || 'AquaCare'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 -mt-1">
                Water Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${active
                    ? 'bg-brand-50 text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              component={Link}
              to="/services"
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#cbd5e1',
                color: '#1e293b',
                fontWeight: 600,
                borderRadius: '10px',
                '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
              }}
            >
              Book Service
            </Button>

            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#0284c7',
                fontWeight: 600,
                borderRadius: '10px',
                '&:hover': { backgroundColor: '#0369a1' },
              }}
            >
              Browse Models
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-sm"
            >
              Explore Purifiers
            </Link>

            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50"
            >
              Request Service / Maintenance
            </Link>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <span>Support: {settings.phone}</span>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-600 font-semibold"
              >
                Admin Area →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
