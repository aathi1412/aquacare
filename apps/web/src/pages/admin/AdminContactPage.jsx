import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import FormField from '../../components/common/FormField.jsx';
import { Mail, Phone, Trash2, Eye, MessageSquare } from 'lucide-react';
import Button from '@mui/material/Button';

const messageStatuses = ['New', 'Read', 'Replied', 'Archived'];

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { addToast } = useToastStore();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact/admin/all');
      setMessages(res.data || []);
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to load messages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenDetail = (msg) => {
    setSelectedMessage(msg);
    setEditStatus(msg.status || 'New');
    setEditNotes(msg.internalNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;

    setSaving(true);
    try {
      await api.patch(`/contact/admin/${selectedMessage._id}`, {
        status: editStatus,
        internalNotes: editNotes,
      });
      addToast({ type: 'success', message: 'Message updated.' });
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/admin/${id}`);
      addToast({ type: 'success', message: 'Message deleted.' });
      fetchMessages();
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Contact Messages</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review general website inquiries, reply status, and customer notes
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading messages..." />
      ) : messages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          No contact messages received yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{msg.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{msg.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 truncate max-w-[200px]">
                    {msg.subject || 'General Inquiry'}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        msg.status === 'New'
                          ? 'bg-amber-100 text-amber-800'
                          : msg.status === 'Replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenDetail(msg)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="View / Update"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete"
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

      {/* Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        size="md"
      >
        {selectedMessage && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedMessage.name}</span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Email: {selectedMessage.email} | Phone: {selectedMessage.phone}
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="block text-slate-900 mb-1">Subject: {selectedMessage.subject}</strong>
                <p className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <FormField label="Status">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {messageStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Internal Follow-up Notes">
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Notes on communication..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outlined" onClick={() => setSelectedMessage(null)}>
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
