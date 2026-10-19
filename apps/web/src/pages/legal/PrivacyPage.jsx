import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer size="small">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400">Effective Date: October 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Information We Collect</h2>
              <p>
                When you submit an enquiry, service request, or contact message through our website, we collect your name, phone number, email address, service location, and details regarding your water purifier or enquiry. We do not process or store credit card, debit card, or payment gateway information as online payment transactions are not conducted through this site.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. How We Use Your Information</h2>
              <p>
                Information submitted is used exclusively by our certified water specialists and technical service team to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Respond directly to product queries and pricing requests.</li>
                <li>Coordinate and schedule on-site water quality assessments and installations.</li>
                <li>Dispatch technicians for routine filter replacement, maintenance, or repair.</li>
                <li>Activate product warranty and AMC maintenance records.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Third-Party Sharing</h2>
              <p>
                We do not sell, rent, or trade your personal contact details to external marketing agencies or third parties. Information is only shared with our internal certified technicians and logistics personnel to fulfill requested on-site service appointments.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Data Security</h2>
              <p>
                We enforce standard administrative and technical safeguards to protect your personal information from unauthorized access, alteration, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Contact Us</h2>
              <p>
                If you have questions regarding your data or wish to have your contact details updated or removed from our service records, please contact our support desk at support@AquaCare.com.
              </p>
            </section>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
