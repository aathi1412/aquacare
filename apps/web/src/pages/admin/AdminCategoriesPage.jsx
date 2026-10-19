import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import Button from '@mui/material/Button';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToastStore();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/admin/all');
      setCategories(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to fetch categories.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setDisplayOrder(categories.length + 1);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(cat.displayOrder || 0);
    setIsPublished(cat.isPublished !== undefined ? cat.isPublished : true);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({ type: 'error', message: 'Category name is required.' });
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image: image.trim(),
      displayOrder: Number(displayOrder),
      isPublished,
    };

    try {
      if (editingCategory) {
        await api.put(`/categories/admin/${editingCategory._id}`, payload);
        addToast({ type: 'success', message: 'Category updated successfully.' });
      } else {
        await api.post('/categories/admin', payload);
        addToast({ type: 'success', message: 'Category created successfully.' });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to save category.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      await api.delete(`/categories/admin/${cat._id}`);
      addToast({ type: 'success', message: 'Category deleted successfully.' });
      fetchCategories();
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Cannot delete category while products are assigned to it.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Category Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Organise water purifiers into form factor categories with safe deletion checks
          </p>
        </div>

        <Button
          variant="contained"
          onClick={openCreateModal}
          startIcon={<Plus className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7' }}
        >
          Add Category
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading categories..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-3">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5 border" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Layers className="w-4 h-4" />
                      </div>
                    )}
                    <span>{cat.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                    {cat.slug}
                  </td>
                  <td className="py-3.5 px-4">{cat.displayOrder || 0}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cat.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {cat.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Category"
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

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        size="md"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Category Name" required>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCategory && !slug) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .trim()
                      .replace(/[\s\W-]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                  );
                }
              }}
              placeholder="e.g. Under-Sink Purifiers"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Slug" required helperText="Unique URL identifier">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. under-sink-purifiers"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
            />
          </FormField>

          <FormField label="Category Image URL">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Short Description">
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for category listings..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm resize-none"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Display Order">
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </FormField>

            <div className="flex items-center pt-6">
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
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : 'Save Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
