import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import NotificationToast from '../common/NotificationToast.jsx';
import { useSettingsStore } from '../../stores/settingsStore.js';

export default function PublicLayout() {
  const { fetchPublicSettings } = useSettingsStore();

  useEffect(() => {
    fetchPublicSettings();
  }, [fetchPublicSettings]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <NotificationToast />
    </div>
  );
}
