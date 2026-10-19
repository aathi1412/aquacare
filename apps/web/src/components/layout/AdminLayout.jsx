import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import NotificationToast from '../common/NotificationToast.jsx';
import {
  LayoutDashboard,
  Package,
  Layers,
  Wrench,
  HelpCircle,
  Inbox,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Droplets,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Product Enquiries', href: '/admin/enquiries', icon: Inbox },
    { label: 'Service Requests', href: '/admin/service-requests', icon: Calendar },
    { label: 'Contact Messages', href: '/admin/contact', icon: MessageSquare },
    { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-aqua-400 text-white flex items-center justify-center shadow-md">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                AquaCare Admin
              </span>
              <span className="text-[10px] uppercase font-semibold text-aqua-400 tracking-wider">
                Management Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user & exit */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-1">
            <div className="text-xs truncate max-w-[140px]">
              <span className="text-white font-bold block truncate">{user?.name || 'Admin'}</span>
              <span className="text-slate-500 truncate block text-[11px]">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-64 bg-slate-900 text-slate-300 p-4 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-bold text-white text-base">AquaCare Admin</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight capitalize">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      <NotificationToast />
    </div>
  );
}
