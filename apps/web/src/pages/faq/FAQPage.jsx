import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFaqs() {
      try {
        setLoading(true);
        const res = await api.get('/faqs');
        setFaqs(res.data || []);
      } catch (err) {
        console.error('Error loading FAQs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const categories = [
    { label: 'All Questions', value: 'all' },
    { label: 'Products & Technology', value: 'products' },
    { label: 'Installation & Setup', value: 'installation' },
    { label: 'Maintenance & Filters', value: 'maintenance' },
    { label: 'Warranty & Support', value: 'warranty' },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer size="small">
        <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

        {/* Header */}
        <div className="mt-6 mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>Support & Guidance</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Find immediate answers regarding water TDS levels, filter replacement intervals, warranty coverage, and certified installation workflows.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  selectedCategory === cat.value
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordions List */}
        {loading ? (
          <LoadingState message="Loading questions..." />
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200 p-8">
            No questions matched your search criteria.
          </div>
        ) : (
          <div className="space-y-3.5 mb-16">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq._id;
              return (
                <div
                  key={faq._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq._id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-brand-600 transition"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Contact Help */}
        <div className="bg-brand-50/70 border border-brand-100 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center gap-3">
          <MessageSquare className="w-8 h-8 text-brand-600" />
          <h3 className="text-lg font-bold text-slate-900">Still Have Questions?</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Can’t find the answer you are looking for? Please contact our friendly water testing and support specialists directly.
          </p>
          <Button component={Link} to="/contact" variant="contained" sx={{ mt: 1 }}>
            Contact Our Support Desk
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
