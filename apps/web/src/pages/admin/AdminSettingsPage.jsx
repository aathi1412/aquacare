import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import { useSettingsStore } from '../../stores/settingsStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Save } from 'lucide-react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToastStore();
  const { fetchPublicSettings } = useSettingsStore();

  // Settings State
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  // Hero section
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');

  // Footer
  const [footerAbout, setFooterAbout] = useState('');
  const [footerCopyright, setFooterCopyright] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await api.get('/settings/admin');
        const s = res.data || {};
        setBusinessName(s.businessName || 'AquaPure');
        setTagline(s.tagline || '');
        setLogoUrl(s.logoUrl || '');
        setPhone(s.phone || '');
        setEmail(s.email || '');
        setWhatsapp(s.whatsapp || '');
        setAddress(s.address || '');
        setServiceArea(s.serviceArea || '');
        setBusinessHours(s.businessHours || '');
        setMapEmbedUrl(s.mapEmbedUrl || '');

        setHeroTitle(s.hero?.title || '');
        setHeroSubtitle(s.hero?.subtitle || '');
        setHeroImage(s.hero?.heroImage || '');

        setFooterAbout(s.footer?.aboutText || '');
        setFooterCopyright(s.footer?.copyrightText || '');
      } catch (err) {
        addToast({ type: 'error', message: err.message || 'Failed to load settings.' });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      businessName,
      tagline,
      logoUrl,
      phone,
      email,
      whatsapp,
      address,
      serviceArea,
      businessHours,
      mapEmbedUrl,
      hero: {
        title: heroTitle,
        subtitle: heroSubtitle,
        heroImage,
      },
      footer: {
        aboutText: footerAbout,
        copyrightText: footerCopyright,
      },
    };

    try {
      await api.put('/settings/admin', payload);
      addToast({ type: 'success', message: 'Website settings saved and updated.' });
      await fetchPublicSettings();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading settings..." fullScreen />;
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Website & Business Settings</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure contact numbers, business hours, service zones, and homepage hero banner
          </p>
        </div>

        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' } }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* 1. Brand Identity & Contact */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">1. Brand Identity & Contact Info</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Business Name" required>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Brand Tagline">
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Helpline Phone" required>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Support Email" required>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="WhatsApp Number">
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+18005550199"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Physical Address / Headquarters">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Designated Service Region / Areas">
            <input
              type="text"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Metropolitan & Surrounding Regions"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>
        </div>

        <FormField label="Business Operating Hours">
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </FormField>
      </div>

      {/* 2. Homepage Hero Content */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">2. Homepage Hero Showcase Banner</h3>

        <FormField label="Hero Headline">
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </FormField>

        <FormField label="Hero Subheading / Value Proposition">
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm resize-none"
          />
        </FormField>

        <FormField label="Hero Featured Purifier Image URL">
          <input
            type="url"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </FormField>
      </div>

      {/* 3. Footer & Map Embed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">3. Footer & Map Configuration</h3>

        <FormField label="Footer About Text">
          <textarea
            rows={2}
            value={footerAbout}
            onChange={(e) => setFooterAbout(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </FormField>

        <FormField label="Footer Copyright Notice">
          <input
            type="text"
            value={footerCopyright}
            onChange={(e) => setFooterCopyright(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </FormField>

        <FormField label="Google Map Embed URL (Optional)">
          <input
            type="text"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7', px: 4, py: 1.2 }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}
