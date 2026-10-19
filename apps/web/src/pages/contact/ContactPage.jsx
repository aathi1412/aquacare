import { useSettingsStore } from '../../stores/settingsStore.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import ContactForm from '../../components/forms/ContactForm.jsx';
import { Phone, Mail, MapPin, Clock, MessageCircle, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useSettingsStore();

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Contact AquaCare' }]} />

        {/* Page Heading */}
        <div className="mt-6 mb-12 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200 mb-3">
            <Phone className="w-3.5 h-3.5 text-brand-600" />
            <span>We Are Here To Help</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Get In Touch With AquaCare
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Have questions about system suitability, water testing, installations, or AMC contracts? Reach out through any of our channels below.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Phone Support & Helpline</h4>
                <p className="text-base font-extrabold text-brand-700 mt-0.5">{settings.phone}</p>
                <p className="text-xs text-slate-500 mt-1">Direct line to our technical consultation desk.</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs flex items-start gap-4 hover:border-emerald-400 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Instant WhatsApp Chat</h4>
                  <p className="text-base font-extrabold text-emerald-700 mt-0.5">Chat With Specialist</p>
                  <p className="text-xs text-slate-500 mt-1">Share water test reports or location pin for fast dispatch.</p>
                </div>
              </a>
            )}

            {/* Email Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-aqua-50 text-aqua-600 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Email Enquiries</h4>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{settings.email}</p>
                <p className="text-xs text-slate-500 mt-1">Send floor plans or commercial tender inquiries.</p>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Main Office</h5>
                  <p className="text-sm text-slate-700 mt-0.5">{settings.address}</p>
                  <p className="text-xs text-slate-500 mt-1">Service Area: {settings.serviceArea}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating Hours</h5>
                  <p className="text-sm text-slate-700 mt-0.5">{settings.businessHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Map Embed (if configured in settings) */}
        {settings.mapEmbedUrl && (
          <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm h-80 sm:h-96 w-full mb-12">
            <iframe
              src={settings.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="AquaCare Service Headquarters Location"
            />
          </div>
        )}
      </PageContainer>
    </div>
  );
}
