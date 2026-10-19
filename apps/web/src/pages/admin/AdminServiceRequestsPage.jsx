import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Search, Eye, Trash2, Calendar, MapPin, Phone, Mail, Wrench } from 'lucide-react';
import Button from '@mui/material/Button';

const requestStatuses = ['New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Editor Modal State
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { addToast } = useToastStore();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedStatus) params.set('status', selectedStatus);

      const res = await api.get(`/service-requests/admin/all?${params.toString()}`);
      setRequests(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to load service requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [search, selectedStatus]);

  const handleOpenDetail = (req) => {
    setSelectedRequest(req);
    setEditStatus(req.status || 'New');
    setEditNotes(req.internalNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSaving(true);
    try {
      await api.patch(`/service-requests/admin/${selectedRequest._id}`, {
        status: editStatus,
        internalNotes: editNotes,
      });
      addToast({ type: 'success', message: 'Service request updated successfully.' });
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to update request.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service request log?')) return;
    try {
      await api.delete(`/service-requests/admin/${id}`);
      addToast({ type: 'success', message: 'Service request record deleted.' });
      fetchRequests();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service Request Desk</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track technician bookings, maintenance requests, and schedule appointments
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, location, or service..."
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
            {requestStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <LoadingState message="Loading service requests..." />
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          No service requests matching your criteria.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Preferred Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{req.customerName}</div>
                      <div className="text-[11px] font-normal text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{req.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {req.serviceType}
                      {req.productModel && (
                        <div className="text-[11px] text-brand-600 font-mono">
                          Model: {req.productModel}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600 truncate max-w-[150px]">
                      {req.location}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {req.preferredDate || 'Earliest available'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          req.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : req.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(req)}
                          className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="View Details & Update Status"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Request"
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

      {/* Service Request Detail Modal */}
      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title="Service Request Details & Technician Dispatch"
        size="md"
      >
        {selectedRequest && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">
                  {selectedRequest.customerName}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>Phone: <strong className="text-slate-900">{selectedRequest.phone}</strong></div>
                <div>Location: <strong className="text-slate-900">{selectedRequest.location}</strong></div>
                <div>Service: <strong className="text-brand-700">{selectedRequest.serviceType}</strong></div>
                <div>Preferred: <strong className="text-slate-900">{selectedRequest.preferredDate || 'Flexible'}</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <span className="font-semibold text-slate-500 block mb-1">Issue Description:</span>
                <p className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm">
                  {selectedRequest.message}
                </p>
              </div>
            </div>

            <FormField label="Status">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
              >
                {requestStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Internal Admin & Dispatch Notes"
              helperText="Private notes (Technician assigned, replacement parts, time slot)"
            >
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Assigned to Technician Dave for Wednesday 11am slot..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outlined" onClick={() => setSelectedRequest(null)}>
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
