import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, CheckCircle2, ArrowRight, MessageSquareQuote } from 'lucide-react';
import Button from '@mui/material/Button';
import EnquiryModal from './EnquiryModal.jsx';

export default function ProductCard({ product }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80';

  const has360 = Boolean(product.threeSixty?.isEnabled && product.threeSixty?.frames?.length > 1);

  return (
    <>
      <div className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {/* Product Image Area */}
        <Link
          to={`/products/${product.slug}`}
          className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-6 overflow-hidden border-b border-slate-100"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {has360 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/85 backdrop-blur-sm text-white shadow-sm">
                <RotateCw className="w-3 h-3 text-aqua-400" />
                <span>360° View</span>
              </span>
            )}
            {product.isFeatured && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                Featured
              </span>
            )}
          </div>

          {/* Category Tag */}
          {product.categoryName && (
            <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-slate-600 border border-slate-200 shadow-sm">
              {product.categoryName}
            </span>
          )}
        </Link>

        {/* Product Content Details */}
        <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              <Link to={`/products/${product.slug}`}>{product.name}</Link>
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Purification Technology Badge */}
            {product.purificationTechnology && (
              <div className="mt-3 text-xs font-semibold text-aqua-700 bg-aqua-50/80 px-2.5 py-1 rounded-lg border border-aqua-200/60 w-fit">
                {product.purificationTechnology}
              </div>
            )}

            {/* Key feature pills */}
            {product.features && product.features.length > 0 && (
              <ul className="mt-3 space-y-1">
                {product.features.slice(0, 2).map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pricing & Call-to-Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pricing
              </span>
              {product.priceDisplayMode === 'show_price' && product.price ? (
                <span className="text-lg font-extrabold text-slate-900">
                  ₹{product.price}
                </span>
              ) : (
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                  Request Quote
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                component={Link}
                to={`/products/${product.slug}`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
                }}
              >
                View Details
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={() => setIsEnquiryOpen(true)}
                sx={{
                  backgroundColor: '#0284c7',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#0369a1' },
                }}
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        product={product}
      />
    </>
  );
}
