import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import Button from '@mui/material/Button';
import ServiceRequestModal from './ServiceRequestModal.jsx';

export default function ServiceCard({ service }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 justify-between gap-6 hover:-translate-y-1">
        <div>
          {/* Service Image / Header */}
          {service.image && (
            <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 bg-slate-100">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {service.shortDescription}
          </p>

          {/* Features list */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-2 mb-4">
              {service.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Service Conditions / Notes */}
          {service.serviceConditions && service.serviceConditions.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Service Guarantee & Terms</span>
              </div>
              {service.serviceConditions.map((cond, i) => (
                <p key={i}>• {cond}</p>
              ))}
            </div>
          )}
        </div>

        {/* Pricing and Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Standard Rate
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {service.pricingDisplayMode === 'starting_at' && service.price
                ? `From ₹${service.price}`
                : service.pricingDisplayMode === 'fixed' && service.price
                  ? `₹${service.price}`
                  : 'Contact for Pricing'}
            </div>
          </div>

          <Button
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            startIcon={<Wrench className="w-4 h-4" />}
            sx={{
              backgroundColor: '#0284c7',
              '&:hover': { backgroundColor: '#0369a1' },
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Request Service
          </Button>
        </div>
      </div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultServiceType={service.name}
      />
    </>
  );
}
