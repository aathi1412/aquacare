import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useSettingsStore } from '../../stores/settingsStore.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import ProductCard from '../../components/products/ProductCard.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EnquiryModal from '../../components/products/EnquiryModal.jsx';
import ServiceRequestModal from '../../components/services/ServiceRequestModal.jsx';
import {
  Droplets,
  ShieldCheck,
  Wrench,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import Button from '@mui/material/Button';

export default function HomePage() {
  const { settings } = useSettingsStore();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catsRes, prodsRes, faqsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=4'),
          api.get('/faqs'),
        ]);
        setCategories(catsRes.data || []);
        setFeaturedProducts(prodsRes.data || []);
        setFaqs((faqsRes.data || []).slice(0, 4));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-12 pb-16 md:py-24 border-b border-slate-200/60">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Generation Water Purification</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {settings.hero?.title || 'Pure, Mineral-Rich Water for Healthier Living'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {settings.hero?.subtitle ||
                  'Explore advanced RO + UV + Alkaline water purifiers, certified installations, and prompt maintenance services tailored for your home and workplace.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight className="w-4 h-4" />}
                  sx={{
                    backgroundColor: '#0284c7',
                    '&:hover': { backgroundColor: '#0369a1' },
                    py: 1.5,
                    px: 3.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                  }}
                >
                  Explore Purifiers
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setIsServiceOpen(true)}
                  startIcon={<Wrench className="w-4 h-4 text-brand-600" />}
                  sx={{
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
                    py: 1.5,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                  }}
                >
                  Book Service
                </Button>
              </div>

              {/* Hero Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 w-full max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">7-Stage</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">RO + UV + Alkaline</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">Free</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Certified Setup</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">Same-Day</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Service Dispatch</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-brand-100 to-aqua-50 rounded-3xl p-6 shadow-xl border border-white flex items-center justify-center overflow-hidden">
                <img
                  src={
                    settings.hero?.heroImage
                  }
                  alt="AquaCare Premium Water Purifier Showcase"
                  className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                />

                {/* Floating Feature Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Comprehensive 1-Year Warranty</div>
                    <div className="text-[11px] text-slate-500">2 Free preventive visits included</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. PRODUCT CATEGORIES */}
      <section>
        <PageContainer>
          <SectionHeading
            badge="Categories"
            title="Purification Solutions For Every Need"
            subtitle="Select the ideal purification form factor for your home layout, family size, or business operation."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-brand-300 transition-all duration-300"
              >
                <div className="w-full h-36 rounded-2xl bg-slate-50 overflow-hidden mb-4 flex items-center justify-center p-3 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed flex-1">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:text-brand-700">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase bg-brand-100 text-brand-800 mb-2 border border-brand-200">
                Top Rated
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Featured Purifiers
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View Full Catalogue ({featuredProducts.length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingState message="Loading featured systems..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      {/* 4. WHY CHOOSE AquaCare */}
      <section>
        <PageContainer>
          <SectionHeading
            badge="The AquaCare Advantage"
            title="Engineered For Purity & Peace Of Mind"
            subtitle="We believe pristine drinking water should be effortless, completely verified, and supported for life."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Multi-Stage Filtration</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Combines high-rejection RO membranes with medical UV sterilization and natural bio-mineralizers that balance water pH between 7.5 and 8.5.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-aqua-50 text-aqua-600 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Certified Technicians</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All unboxing, wall mounting, and plumbing integration is handled by factory-trained specialists with calibrated TDS and pressure gauges.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Genuine Spares Guarantee</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We only stock original manufacturer filters and food-grade plumbing fittings, eliminating risk of secondary contamination or pressure leaks.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. SERVICE PROCESS WORKFLOW */}
      <section className="bg-slate-900 text-white py-16 md:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3">
              How We Deliver Pure Water To Your Tap
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start gap-3 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-black text-brand-400">01</div>
              <h4 className="text-base font-bold text-white">Select Or Request</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse our product catalogue or request a free on-site water quality consultation.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-black text-brand-400">02</div>
              <h4 className="text-base font-bold text-white">Water TDS Check</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our technician measures your raw inlet TDS and pressure to recommend the exact membrane configuration.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-black text-brand-400">03</div>
              <h4 className="text-base font-bold text-white">Certified Installation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clean installation using food-grade tubing and stainless hardware with zero leakage guarantee.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-black text-brand-400">04</div>
              <h4 className="text-base font-bold text-white">Lifetime AMC Support</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scheduled filter replacements and same-day priority dispatch for routine maintenance.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. FAQ PREVIEW */}
      {faqs.length > 0 && (
        <section>
          <PageContainer size="small">
            <SectionHeading
              badge="FAQ"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about water purification technologies and servicing."
            />

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs"
                >
                  <h4 className="text-base font-bold text-slate-900 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-sm text-slate-600 mt-2.5 ml-7 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
              >
                <span>View all frequently asked questions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </PageContainer>
        </section>
      )}

      {/* 7. BOTTOM CTA BANNER */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-aqua-600 text-white py-14 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-lg">
        <PageContainer>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Ready For Pure Drinking Water At Home?
              </h3>
              <p className="text-brand-100 text-sm sm:text-base mt-2 leading-relaxed">
                Connect with an AquaCare certified specialist today for tailored recommendations, free water testing, or service scheduling.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="contained"
                onClick={() => setIsEnquiryOpen(true)}
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#0369a1',
                  fontWeight: 700,
                  py: 1.5,
                  px: 3,
                  '&:hover': { backgroundColor: '#f0f9ff' },
                }}
              >
                Enquire Now
              </Button>

              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontWeight: 600,
                  py: 1.5,
                  px: 3,
                  '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
      <ServiceRequestModal
        isOpen={isServiceOpen}
        onClose={() => setIsServiceOpen(false)}
      />
    </div>
  );
}
