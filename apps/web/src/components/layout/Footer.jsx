import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore.js';
import {
  Droplets,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function Footer() {
  const { settings } = useSettingsStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-aqua-400 text-white flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                {settings.businessName || 'AquaCare'}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.footer?.aboutText ||
                'AquaCare delivers hospital-grade residential and industrial water purification systems, certified installations, and complete annual maintenance contracts.'}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-aqua-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Water Testing & Installations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Water Purifier Catalogue
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Installation & Relocation
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Filter Replacement & Sanitization
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Annual Maintenance (AMC)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Why Choose AquaCare
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact & Support
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Service Area & Non-ecommerce Notice */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Service Guarantee
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Serving: <strong className="text-slate-300">{settings.serviceArea}</strong>
            </p>

            {/* <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 text-xs text-slate-400">
              <strong className="text-slate-200 block mb-1">Direct Consultation Model</strong>
              This website is a product showcase and service platform. We provide on-site water quality assessments and custom installation quotes rather than generic online checkout carts.
            </div> */}

            <div className="mt-1">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition py-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Management Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-100">
          <div>{settings.footer?.copyrightText}</div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-slate-400 transition">
              Customer Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
