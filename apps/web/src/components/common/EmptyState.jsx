import { PackageOpen } from 'lucide-react';
import Button from '@mui/material/Button';

export default function EmptyState({
  title = 'No items found',
  message = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-slate-200">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <Button
          variant="outlined"
          onClick={onAction}
          sx={{ borderColor: '#cbd5e1', color: '#0f172a' }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
