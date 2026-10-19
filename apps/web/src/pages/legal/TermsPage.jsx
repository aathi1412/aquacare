import React from 'react';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer size="small">
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-400">Effective Date: October 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Nature of the Website</h2>
              <p>
                This website serves as an informational product showcase and service booking portal. It is not an e-commerce platform. No online purchases, cart checkouts, or payment processing occur on this website. All price requests and service appointments are subject to direct confirmation by our coordinators.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Service Requests & Appointments</h2>
              <p>
                Submitting a service request form or product enquiry does not constitute a guaranteed or confirmed booking until confirmed by phone or email consultation with an authorized service coordinator. We reserve the right to verify service location accessibility and water supply parameters prior to confirming dispatch.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Product Specifications & Pricing</h2>
              <p>
                Specifications, purification capabilities (TDS range, flow rates, dimensions), and warranties described on this website reflect manufacturer ratings under standard operating test conditions. Actual performance may vary depending on local water pressure, feed water TDS, temperature, and hardness.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Warranty Terms</h2>
              <p>
                Warranty coverage applies exclusively to manufacturing defects in accordance with the warranty documentation provided at the time of installation. Routine consumable filters (sediment cartridges, carbon blocks, membranes) are covered under preventive maintenance schedules and AMC agreements.
              </p>
            </section>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
