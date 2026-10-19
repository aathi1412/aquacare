import { useSettingsStore } from '../../stores/settingsStore.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import { Droplets, ShieldCheck, HeartPulse, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function AboutPage() {
  const { settings } = useSettingsStore();

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer>
        <Breadcrumbs items={[{ label: 'About AquaCare' }]} />

        {/* Hero Header */}
        <div className="mt-6 mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200 mb-3">
            <Droplets className="w-3.5 h-3.5 text-brand-600" />
            <span>Pure Water Since 2018</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Committed To Healthier Families & Cleaner Water
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
            At {settings.businessName || 'AquaCare'}, our mission is simple: provide every home and business with uncompromisingly pure, sweet, and mineral-balanced drinking water backed by direct specialist consultation and prompt technical service.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Uncompromising Filtration Standards</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We utilise multi-stage filtration technologies including high-rejection Reverse Osmosis, precision UV sterilization chambers, and natural bio-ceramic alkaline cartridges to ensure safe, delicious water.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-aqua-100 text-aqua-700 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Health & Mineral Retention</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike generic RO purifiers that strip away essential minerals, our systems replenish vital electrolytes including calcium and magnesium, maintaining healthy hydration and pH balance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Transparent Lifetime Servicing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our direct consultation model ensures transparent quotes before any service is performed. We stock genuine manufacturer cartridges and offer priority response windows.
            </p>
          </div>
        </div>

        {/* Service Approach Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Our Service Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Why We Operate On A Consultation & Enquiry Model
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Water quality varies dramatically from municipality to borewell supply. A system that excels at 150 ppm TDS will not perform the same at 1,500 ppm TDS. Rather than selling generic boxes through automated carts, we inspect your water quality first, ensure your plumbing is compatible, and deliver a fully calibrated system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Complimentary Water TDS Test</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Pressure Regulation Check</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Food-Grade Fitting Guarantee</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Comprehensive 1-Year Warranty</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#0284c7',
              '&:hover': { backgroundColor: '#0369a1' },
              px: 4,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Speak With A Water Specialist
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
