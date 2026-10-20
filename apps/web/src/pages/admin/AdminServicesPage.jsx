import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '@mui/material/Button';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pricingDisplayMode, setPricingDisplayMode] = useState('contact_for_pricing');
  const [image, setImage] = useState('');
  const [serviceConditions, setServiceConditions] = useState(['Standard installation up to 3m tubing']);
  const [newCondition, setNewCondition] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToastStore();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services/admin/all');
      setServices(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to load services.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setSlug('');
    setShortDescription('');
    setFullDescription('');
    setPrice('');
    setPricingDisplayMode('contact_for_pricing');
    setImage('');
    setServiceConditions(['Free standard installation on all newly purchased models']);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setName(srv.name || '');
    setSlug(srv.slug || '');
    setShortDescription(srv.shortDescription || '');
    setFullDescription(srv.fullDescription || '');
    setPrice(srv.price !== null && srv.price !== undefined ? srv.price : '');
    setPricingDisplayMode(srv.pricingDisplayMode || 'contact_for_pricing');
    setImage(srv.image || '');
    setServiceConditions(srv.serviceConditions || []);
    setIsPublished(srv.isPublished !== undefined ? srv.isPublished : true);
    setIsModalOpen(true);
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setServiceConditions([...serviceConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (idx) => {
    setServiceConditions(serviceConditions.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !shortDescription.trim()) {
      addToast({ type: 'error', message: 'Name and short description are required.' });
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      price: price !== '' ? Number(price) : null,
      pricingDisplayMode,
      image: image.trim(),
      serviceConditions,
      isPublished,
    };

    try {
      if (editingService) {
        await api.put(`/services/admin/${editingService._id}`, payload);
        addToast({ type: 'success', message: 'Service updated successfully.' });
      } else {
        await api.post('/services/admin', payload);
        addToast({ type: 'success', message: 'Service created successfully.' });
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to save service.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (srv) => {
    if (!window.confirm(`Delete service "${srv.name}"?`)) return;
    try {
      await api.delete(`/services/admin/${srv._id}`);
      addToast({ type: 'success', message: 'Service removed.' });
      fetchServices();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage installation, repair, filter replacement packages, and AMC maintenance offerings
          </p>
        </div>

        <Button
          variant="contained"
          onClick={openCreateModal}
          startIcon={<Plus className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7' }}
        >
          Add Service
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading services..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Service Package</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Conditions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {services.map((srv) => (
                <tr key={srv._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{srv.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {srv.shortDescription}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {srv.pricingDisplayMode === 'starting_at' && srv.price
                      ? `From $${srv.price}`
                      : srv.pricingDisplayMode === 'fixed' && srv.price
                        ? `$${srv.price}`
                        : 'Contact for pricing'}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {srv.serviceConditions?.length || 0} condition(s)
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${srv.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {srv.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(srv)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Service"
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
      )}

      {/* Service Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service Offering' : 'Create Service Offering'}
        size="lg"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Service Name" required>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingService && !slug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[\s\W-]+/g, '-')
                        .replace(/^-+|-+$/g, '')
                    );
                  }
                }}
                placeholder="e.g. Certified Installation & Setup"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </FormField>

            <FormField label="Slug" required helperText="URL identifier">
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. certified-installation-setup"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Pricing Display Mode">
              <select
                value={pricingDisplayMode}
                onChange={(e) => setPricingDisplayMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="contact_for_pricing">Contact for Pricing</option>
                <option value="starting_at">Starting At Price</option>
                <option value="fixed">Fixed Price</option>
              </select>
            </FormField>

            <FormField label="Price (₹ INR, Optional)">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 14999"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </FormField>
          </div>

          <FormField label="Service Image URL (Optional)">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Short Description" required>
            <textarea
              rows={2}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Summary of service scope and benefits..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm resize-none"
            />
          </FormField>

          <FormField label="Full Description">
            <textarea
              rows={3}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed explanation of what the technician inspects, calibrates, and replaces..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          {/* Conditions list */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Service Conditions & Scope
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g. Covers up to 3m food-grade tubing..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <Button variant="outlined" size="small" onClick={handleAddCondition}>
                Add
              </Button>
            </div>
            <div className="space-y-1">
              {serviceConditions.map((cond, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                  <span>• {cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(i)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Published on website</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : 'Save Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
