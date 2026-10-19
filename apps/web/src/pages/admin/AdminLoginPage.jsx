import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { useToastStore } from '../../stores/toastStore.js';
import { Droplets, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@aquapure.com');
  const [password, setPassword] = useState('Admin@123456');
  const { login, isLoading, error } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      addToast({ type: 'success', message: 'Welcome back to the Admin Dashboard!' });
      navigate(from, { replace: true });
    } else {
      addToast({ type: 'error', message: result.message || 'Invalid administrator credentials.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 animate-in fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-aqua-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
            <Droplets className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AquaPure Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Sign in to manage water purifiers, services, and enquiries
          </p>
        </div>

        {/* Demo Helper Box */}
        <div className="bg-brand-50/80 border border-brand-200/80 rounded-2xl p-3.5 mb-6 text-xs text-brand-900 flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Demo Credentials Pre-filled:</span>
            <div className="mt-0.5 text-slate-600">
              Email: <code className="font-mono text-brand-700 font-semibold">admin@aquapure.com</code>
              <br />
              Password: <code className="font-mono text-brand-700 font-semibold">Admin@123456</code>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aquapure.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <Lock className="w-4 h-4" />}
            sx={{
              backgroundColor: '#0284c7',
              '&:hover': { backgroundColor: '#0369a1' },
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '12px',
              mt: 2,
            }}
          >
            {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
