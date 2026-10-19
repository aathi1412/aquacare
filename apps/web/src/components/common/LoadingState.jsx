import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingState({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
      <CircularProgress size={44} thickness={4} sx={{ color: '#0284c7' }} />
      <p className="text-slate-600 font-medium text-sm tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
