import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import ProductGallery from '../../components/products/ProductGallery.jsx';
import ProductCard from '../../components/products/ProductCard.jsx';
import EnquiryModal from '../../components/products/EnquiryModal.jsx';
import ServiceRequestModal from '../../components/services/ServiceRequestModal.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
} from 'lucide-react';
import Button from '@mui/material/Button';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
      } catch (err) {
        setError(err.message || 'Product not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading purifier specifications..." fullScreen />;
  }

  if (error || !product) {
    return (
      <PageContainer className="py-16">
        <ErrorState
          title="Product Not Found"
          message={error || 'The requested water purifier does not exist or has been unpublished.'}
        />
        <div className="text-center mt-6">
          <Button component={Link} to="/products" variant="contained">
            Back to Purifier Catalogue
          </Button>
        </div>
      </PageContainer>
    );
  }

  const categoryName = product.category?.name || product.categoryName || 'Water Purifier';

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer>
        <Breadcrumbs
          items={[
            { label: 'Water Purifiers', href: '/products' },
            { label: categoryName, href: `/products?category=${product.category?.slug || ''}` },
            { label: product.name },
          ]}
        />

        {/* Main Product Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-6">
          {/* Left Column: Interactive Multi-Image Gallery & 360 Viewer */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <ProductGallery
              images={product.images || []}
              threeSixty={product.threeSixty}
              productName={product.name}
            />

            {/* Warranty & Guarantee Callout */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>AquaCare Quality & Installation Guarantee</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.installationInfo ||
                  'Free standard installation included with certified technician within 24-48 hours of purchase enquiry.'}
              </p>
              {product.warranty && (
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 w-fit">
                  <Award className="w-4 h-4" />
                  <span>{product.warranty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Specifications, Features, and Enquire CTA */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Title & Category Badge */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-100 text-brand-800 border border-brand-200 mb-3">
                {categoryName}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Purification Tech Badge */}
              {product.purificationTechnology && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Purification:</span>
                  <span className="text-xs font-bold text-aqua-800 bg-aqua-100/70 px-3 py-1 rounded-lg border border-aqua-200">
                    {product.purificationTechnology}
                  </span>
                </div>
              )}
            </div>

            {/* Pricing / Mode */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Commercial Pricing
                </span>
                {product.priceDisplayMode === 'show_price' && product.price ? (
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    ₹{product.price}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      (Includes standard installation)
                    </span>
                  </div>
                ) : (
                  <div className="text-base font-bold text-brand-700 mt-0.5">
                    Custom Quote on Request
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="contained"
                  onClick={() => setIsEnquiryOpen(true)}
                  sx={{
                    backgroundColor: '#0284c7',
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: '#0369a1' },
                  }}
                >
                  Enquire Now
                </Button>
              </div>
            </div>

            {/* Short Description */}
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {product.shortDescription}
            </div>

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-600" />
                  <span>Key Features & Benefits</span>
                </h3>
                <ul className="grid grid-cols-1 gap-2.5">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Technical Specifications
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {product.capacity && (
                    <div className="flex items-center justify-between p-3.5 px-5 bg-slate-50/50">
                      <span className="font-semibold text-slate-600">Storage / Output Capacity</span>
                      <span className="font-bold text-slate-900">{product.capacity}</span>
                    </div>
                  )}
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3.5 px-5 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                    >
                      <span className="font-medium text-slate-600">{spec.key}</span>
                      <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Detailed Description */}
            {product.fullDescription && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Product Overview & Performance Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>
            )}

            {/* Contact / Service CTA Box */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Need Installation Assistance?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Our certified technicians can assess your water supply and handle complete setup.
                </p>
              </div>
              <Button
                variant="outlined"
                onClick={() => setIsServiceOpen(true)}
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Book Service Visit
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Related Water Purifiers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          product={product}
        />
        <ServiceRequestModal
          isOpen={isServiceOpen}
          onClose={() => setIsServiceOpen(false)}
          defaultServiceType="Certified Installation & Setup"
        />
      </PageContainer>
    </div>
  );
}
