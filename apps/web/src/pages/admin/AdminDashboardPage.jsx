import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import {
  Package,
  Layers,
  Inbox,
  Calendar,
  MessageSquare,
  ArrowRight,
  Database,
  PlusCircle,
} from 'lucide-react';
import Button from '@mui/material/Button';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message="Loading dashboard metrics..." fullScreen />;
  }

  if (error || !stats) {
    return <ErrorState message={error || 'Failed to load dashboard data.'} />;
  }

  const { metrics, databaseMode, recentEnquiries = [], recentServiceRequests = [] } = stats;

  return (
    <div className="flex flex-col gap-8">
      {/* Database Mode / Environment Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Data Storage Engine
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>{databaseMode}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            component={Link}
            to="/admin/products/new"
            variant="contained"
            size="small"
            startIcon={<PlusCircle className="w-4 h-4" />}
            sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' } }}
          >
            Add New Purifier
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Products */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{metrics.totalProducts}</div>
            <div className="text-xs text-brand-600 font-semibold mt-1">Published catalogue</div>
          </div>
        </Link>

        {/* Categories */}
        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{metrics.totalCategories}</div>
            <div className="text-xs text-purple-600 font-semibold mt-1">Form factors</div>
          </div>
        </Link>

        {/* New Enquiries */}
        <Link
          to="/admin/enquiries"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              New Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{metrics.newEnquiries}</div>
            <div className="text-xs text-amber-600 font-semibold mt-1">Pending follow-up</div>
          </div>
        </Link>

        {/* Service Requests */}
        <Link
          to="/admin/service-requests"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Service Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{metrics.pendingServiceRequests}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Pending dispatch</div>
          </div>
        </Link>

        {/* Contact Messages */}
        <Link
          to="/admin/contact"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Messages
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{metrics.newContactMessages}</div>
            <div className="text-xs text-blue-600 font-semibold mt-1">General contacts</div>
          </div>
        </Link>
      </div>

      {/* Tables Section: Recent Enquiries & Recent Service Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Product Enquiries */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Product Enquiries
            </h2>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No product enquiries received yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{enq.customerName}</div>
                        <div className="text-[11px] text-slate-400">{enq.phone}</div>
                      </td>
                      <td className="py-3 px-4 truncate max-w-[150px]">
                        {enq.productName || 'General Enquiry'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-brand-100 text-brand-800'
                            }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Service Requests */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Service Requests
            </h2>
            <Link
              to="/admin/service-requests"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentServiceRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No service requests received yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentServiceRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{req.customerName}</div>
                        <div className="text-[11px] text-slate-400">{req.location}</div>
                      </td>
                      <td className="py-3 px-4 truncate max-w-[150px]">
                        {req.serviceType}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'New'
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
