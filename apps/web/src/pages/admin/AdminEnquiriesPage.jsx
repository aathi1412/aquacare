import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Search, Filter, Trash2, Eye, Edit3, Phone, Mail, Clock } from 'lucide-react';
import Button from '@mui/material/Button';

const statuses = ['New', 'Contacted', 'In Progress', 'Resolved', 'Closed'];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Modal Editor State
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { addToast } = useToastStore();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedStatus) params.set('status', selectedStatus);

      const res = await api.get(`/enquiries/admin/all?${params.toString()}`);
      setEnquiries(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to fetch enquiries.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, selectedStatus]);

  const handleOpenDetail = (enq) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status || 'New');
    setEditNotes(enq.internalNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setSaving(true);
    try {
      await api.patch(`/enquiries/admin/${selectedEnquiry._id}`, {
        status: editStatus,
        internalNotes: editNotes,
      });
      addToast({ type: 'success', message: 'Enquiry updated successfully.' });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to update enquiry.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await api.delete(`/enquiries/admin/${id}`);
      addToast({ type: 'success', message: 'Enquiry deleted.' });
      fetchEnquiries();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Enquiries</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer product enquiries, quotation requests, and internal follow-up notes
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, phone, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium"
          >
            <option value="">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      {loading ? (
        <LoadingState message="Loading enquiries..." />
      ) : enquiries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          No enquiries found matching your search.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {enq.customerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{enq.phone}</span>
                      </div>
                      {enq.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-300" />
                          <span>{enq.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 truncate max-w-[160px]">
                      {enq.productName || 'General Enquiry'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(enq)}
                          className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="View / Update Notes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Enquiry"
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

      {/* Enquiry Detail & Status Update Modal */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title="Enquiry Details & Follow-up Notes"
        size="md"
      >
        {selectedEnquiry && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            {/* Customer Snapshot */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">
                  {selectedEnquiry.customerName}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-slate-600 pt-1">
                <span>Phone: <strong className="text-slate-900">{selectedEnquiry.phone}</strong></span>
                {selectedEnquiry.email && <span>Email: <strong className="text-slate-900">{selectedEnquiry.email}</strong></span>}
              </div>

              {selectedEnquiry.productName && (
                <div className="pt-1 text-slate-700">
                  Interested in: <strong className="text-brand-700">{selectedEnquiry.productName}</strong>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/80">
                <span className="font-semibold text-slate-500 block mb-1">Customer Message:</span>
                <p className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {selectedEnquiry.message}
                </p>
              </div>
            </div>

            {/* Status Selector */}
            <FormField label="Enquiry Status">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Internal Private Notes */}
            <FormField
              label="Internal Admin Notes"
              helperText="Private - Never displayed publicly"
            >
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Log phone call outcome, customer budget, quote sent, or technician dispatch notes..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outlined" onClick={() => setSelectedEnquiry(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Updating...' : 'Save Updates'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
