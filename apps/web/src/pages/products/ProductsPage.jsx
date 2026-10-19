import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api.js';
import PageContainer from '../../components/common/PageContainer.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import ProductCard from '../../components/products/ProductCard.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { Search, X } from 'lucide-react';
import Button from '@mui/material/Button';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (categoryParam) params.set('category', categoryParam);
      if (searchParam) params.set('search', searchParam);
      if (sortParam) params.set('sort', sortParam);
      params.set('page', pageParam);
      params.set('limit', 12);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data || []);
      setMeta(res.meta || { total: res.data?.length || 0, page: 1, limit: 12, pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load products catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, searchParam, sortParam, pageParam]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset page to 1 when filters change
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Water Purifiers' }]} />

        {/* Page Heading Banner */}
        <div className="mt-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Water Purifier Catalogue
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Browse our range of domestic and commercial water purifiers featuring multi-stage Reverse Osmosis (RO), Ultra-Violet (UV), Ultrafiltration (UF), and Alkaline bio-mineral enrichment.
          </p>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by purifier name or feature..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition"
            >
              Search
            </button>
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Category Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Category:</span>
              <select
                value={categoryParam}
                onChange={(e) => updateParam('category', e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(categoryParam || searchParam) && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid Content */}
        {loading ? (
          <LoadingState message="Fetching water purifiers..." fullScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProducts} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No purifiers matched your criteria"
            message="Try clearing your search query or selecting a different category to view available models."
            actionLabel="Clear All Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta.pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  disabled={pageParam <= 1}
                  onClick={() => updateParam('page', pageParam - 1)}
                  variant="outlined"
                  size="small"
                >
                  Previous
                </Button>

                <div className="text-sm font-semibold text-slate-600 px-4">
                  Page {meta.page} of {meta.pages}
                </div>

                <Button
                  disabled={pageParam >= meta.pages}
                  onClick={() => updateParam('page', pageParam + 1)}
                  variant="outlined"
                  size="small"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </div>
  );
}
