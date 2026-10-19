import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@mui/material/Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-lg mx-auto bg-white rounded-2xl border border-rose-100 shadow-sm my-6">
      <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          startIcon={<RefreshCw className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' } }}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
