import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCw,
  Search,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import Button from '@mui/material/Button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToastStore();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/admin/all?limit=50&search=${encodeURIComponent(search)}`);
      setProducts(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to load products.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleTogglePublish = async (product) => {
    try {
      await api.patch(`/products/admin/${product._id}/publish`);
      addToast({
        type: 'success',
        message: `Product "${product.name}" ${product.isPublished ? 'unpublished' : 'published'}.`,
      });
      fetchProducts();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/products/admin/${deleteProductTarget._id}`);
      addToast({ type: 'success', message: 'Product deleted successfully.' });
      setDeleteProductTarget(null);
      fetchProducts();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to delete product.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, toggle publishing status, manage galleries and 360 viewer frames
          </p>
        </div>

        <Button
          component={Link}
          to="/admin/products/new"
          variant="contained"
          startIcon={<Plus className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' } }}
        >
          Add Product
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by purifier name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total: {products.length} Products
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingState message="Loading products list..." />
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500">
          No products found. Click "Add Product" to create your first water purifier model.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pricing Mode</th>
                  <th className="py-3.5 px-4">Media</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.images?.[0]?.url ||
                            'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={prod.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">/products/{prod.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {prod.categoryName || 'General'}
                    </td>

                    <td className="py-3.5 px-4">
                      {prod.priceDisplayMode === 'show_price' && prod.price ? (
                        <span className="font-bold text-slate-900">${prod.price}</span>
                      ) : (
                        <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded">
                          Request Price
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">
                          {prod.images?.length || 0} Photos
                        </span>
                        {prod.threeSixty?.isEnabled && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>360° ({prod.threeSixty?.frames?.length || 0})</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                          prod.isPublished
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click to toggle publishing"
                      >
                        {prod.isPublished ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/products/${prod.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="Preview Product Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/products/${prod._id}/edit`}
                          className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteProductTarget(prod)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteProductTarget)}
        onClose={() => setDeleteProductTarget(null)}
        title="Delete Product"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Are you sure you want to delete "{deleteProductTarget?.name}"?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            This action cannot be undone. The product and associated gallery configuration will be permanently removed.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button
              variant="outlined"
              onClick={() => setDeleteProductTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
