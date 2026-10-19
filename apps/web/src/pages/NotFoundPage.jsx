import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer.jsx';
import { Droplet, Home, ArrowLeft } from 'lucide-react';
import Button from '@mui/material/Button';

export default function NotFoundPage() {
  return (
    <div className="py-20 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <PageContainer size="small" className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-brand-100">
          <Droplet className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          Page Not Found
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
          The water purifier model or service page you are looking for may have been moved, renamed, or is temporarily offline.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<Home className="w-4 h-4" />}
            sx={{
              backgroundColor: '#0284c7',
              '&:hover': { backgroundColor: '#0369a1' },
              fontWeight: 700,
              px: 3,
            }}
          >
            Return Home
          </Button>

          <Button
            component={Link}
            to="/products"
            variant="outlined"
            startIcon={<ArrowLeft className="w-4 h-4" />}
            sx={{ borderColor: '#cbd5e1', color: '#0f172a' }}
          >
            View Catalogue
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
