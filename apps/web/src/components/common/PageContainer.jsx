export default function PageContainer({ children, className = '', size = 'default' }) {
  const maxW = size === 'small' ? 'max-w-4xl' : size === 'full' ? 'max-w-full' : 'max-w-7xl';
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${maxW} ${className}`}>
      {children}
    </div>
  );
}
