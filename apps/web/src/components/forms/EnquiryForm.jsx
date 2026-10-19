import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquirySchema } from '../../schemas/enquiry.schema.js';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import FormField from '../common/FormField.jsx';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Send, CheckCircle2 } from 'lucide-react';

export default function EnquiryForm({
  product = null,
  sourcePage = '',
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      message: product
        ? `Hi, I am interested in ${product.name}. Please provide pricing details and installation availability.`
        : '',
      product: product?._id || product?.id || '',
      productName: product?.name || '',
      sourcePage: sourcePage || window.location.pathname,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/enquiries', data);
      setIsSuccess(true);
      addToast({
        type: 'success',
        message: 'Enquiry submitted successfully! A water specialist will reach out shortly.',
      });
      reset();
      if (onSuccess) {
        setTimeout(onSuccess, 1800);
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">Enquiry Received!</h4>
        <p className="text-slate-600 text-sm max-w-sm leading-relaxed mb-6">
          Thank you for reaching out. One of our certified water specialists will contact you shortly to answer your questions and assist with your requirements.
        </p>
        <Button
          variant="outlined"
          onClick={() => setIsSuccess(false)}
          sx={{ borderColor: '#cbd5e1', color: '#0f172a' }}
        >
          Send Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {product && (
        <div className="flex items-center gap-3 p-3 bg-brand-50/70 border border-brand-100 rounded-xl mb-1">
          {product.images?.[0]?.url && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-brand-100"
            />
          )}
          <div>
            <div className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Enquiring About</div>
            <div className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</div>
          </div>
        </div>
      )}

      <FormField label="Your Full Name" id="customerName" required error={errors.customerName?.message}>
        <input
          id="customerName"
          type="text"
          placeholder="e.g. John Doe"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
          {...register('customerName')}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Phone Number" id="phone" required error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. +1 555-0199"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            {...register('phone')}
          />
        </FormField>

        <FormField label="Email Address (Optional)" id="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="e.g. john@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            {...register('email')}
          />
        </FormField>
      </div>

      <FormField label="Enquiry Details / Message" id="message" required error={errors.message?.message}>
        <textarea
          id="message"
          rows={3}
          placeholder="Please share any questions regarding water TDS, features, pricing or installation..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-none"
          {...register('message')}
        />
      </FormField>

      <div className="mt-2">
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Send className="w-4 h-4" />}
          sx={{
            backgroundColor: '#0284c7',
            '&:hover': { backgroundColor: '#0369a1' },
            py: 1.5,
            fontSize: '0.95rem',
          }}
        >
          {isSubmitting ? 'Submitting Enquiry...' : 'Submit Product Enquiry'}
        </Button>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        We respect your privacy. No spam. A certified specialist will reach out during business hours.
      </p>
    </form>
  );
}
