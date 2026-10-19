import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import Button from '@mui/material/Button';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToastStore();

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faqs/admin/all');
      setFaqs(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to load FAQs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('general');
    setDisplayOrder(faqs.length + 1);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question || '');
    setAnswer(faq.answer || '');
    setCategory(faq.category || 'general');
    setDisplayOrder(faq.displayOrder || 0);
    setIsPublished(faq.isPublished !== undefined ? faq.isPublished : true);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      addToast({ type: 'error', message: 'Question and answer are required.' });
      return;
    }

    setSaving(true);
    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      category,
      displayOrder: Number(displayOrder),
      isPublished,
    };

    try {
      if (editingFaq) {
        await api.put(`/faqs/admin/${editingFaq._id}`, payload);
        addToast({ type: 'success', message: 'FAQ updated successfully.' });
      } else {
        await api.post('/faqs/admin', payload);
        addToast({ type: 'success', message: 'FAQ created successfully.' });
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to save FAQ.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/admin/${id}`);
      addToast({ type: 'success', message: 'FAQ deleted.' });
      fetchFaqs();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">FAQ Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer knowledgebase questions and answers across products and warranty
          </p>
        </div>

        <Button
          variant="contained"
          onClick={openCreateModal}
          startIcon={<Plus className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7' }}
        >
          Add Question
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading questions..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Question</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {faqs.map((faq) => (
                <tr key={faq._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-slate-900 line-clamp-1">{faq.question}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{faq.answer}</div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-medium text-slate-600">
                    {faq.category}
                  </td>
                  <td className="py-3.5 px-4">{faq.displayOrder || 0}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        faq.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {faq.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit FAQ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete FAQ"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
        size="md"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Question" required>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How often should filters be replaced?"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="general">General</option>
              <option value="products">Products & Technologies</option>
              <option value="installation">Installation</option>
              <option value="maintenance">Maintenance</option>
              <option value="warranty">Warranty</option>
            </select>
          </FormField>

          <FormField label="Answer" required>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Detailed explanation..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
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
              {saving ? 'Saving...' : 'Save FAQ'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
