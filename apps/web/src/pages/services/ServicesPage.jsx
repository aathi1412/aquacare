import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import ServiceCard from '../../components/services/ServiceCard.jsx';
import ServiceRequestForm from '../../components/forms/ServiceRequestForm.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import {
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/services');
        setServices(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load services.');
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Services & AMC Maintenance' }]} />

        {/* Page Hero Header */}
        <div className="mt-6 mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200 mb-3">
            <Wrench className="w-3.5 h-3.5 text-brand-600" />
            <span>Dedicated Technician Support</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Water Purifier Service, Repair & Maintenance
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Ensure hospital-standard purity 365 days a year. Our certified technicians provide certified unboxing, rapid breakdown repairs, routine membrane sanitization, and all-inclusive AMC plans.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <LoadingState message="Loading service packages..." fullScreen />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {services.map((srv) => (
              <ServiceCard key={srv._id} service={srv} />
            ))}
          </div>
        )}

        {/* Embedded Book A Service Section */}
        <section id="book-service" className="pt-10 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 w-fit">
                Online Service Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Schedule An Expert Technician Visit
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you need a new purifier wall-mounted, filter replacement cartridges delivered, or urgent leak troubleshooting, submit your details below. Our service coordinator will call you to confirm appointment timing.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Genuine Certified Spares</h4>
                    <p className="text-xs text-slate-500">Only manufacturer-certified filters & parts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Priority Response Window</h4>
                    <p className="text-xs text-slate-500">Same-day inspection for emergency leaks</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-aqua-100 text-aqua-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">90-Day Service Guarantee</h4>
                    <p className="text-xs text-slate-500">All repair workmanship is backed by warranty</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
              <ServiceRequestForm />
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
