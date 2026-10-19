import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceRequestSchema } from '../../schemas/serviceRequest.schema.js';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import FormField from '../common/FormField.jsx';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Wrench, CheckCircle2 } from 'lucide-react';

const serviceOptions = [
  'Certified Installation & Setup',
  'Routine Filter Replacement & Sanitization',
  'Repair, Troubleshooting & Leak Fix',
  'Annual Maintenance Contract (AMC Plans)',
  'Water Quality / TDS Inspection',
  'Relocation / Re-installation',
];

export default function ServiceRequestForm({
  defaultServiceType = '',
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
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      location: '',
      serviceType: defaultServiceType || serviceOptions[0],
      productModel: '',
      preferredDate: '',
      message: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/service-requests', data);
      setIsSuccess(true);
      addToast({
        type: 'success',
        message: 'Service request logged! Our dispatcher will call to confirm scheduling.',
      });
      reset();
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Failed to submit service request.',
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
        <h4 className="text-xl font-bold text-slate-900 mb-2">Service Request Logged!</h4>
        <p className="text-slate-600 text-sm max-w-sm leading-relaxed mb-6">
          Thank you! Our technical service desk will review your requirements and phone you shortly to confirm technician availability and preferred appointment timing.
        </p>
        <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6">
          * Note: Submission registers your request in our queue. Service visits are confirmed after direct coordinator phone verification.
        </p>
        <Button
          variant="outlined"
          onClick={() => setIsSuccess(false)}
          sx={{ borderColor: '#cbd5e1', color: '#0f172a' }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" id="customerName" required error={errors.customerName?.message}>
          <input
            id="customerName"
            type="text"
            placeholder="e.g. Jane Smith"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('customerName')}
          />
        </FormField>

        <FormField label="Contact Phone" id="phone" required error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. +1 555-0123"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('phone')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Email Address (Optional)" id="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="e.g. jane@example.com"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('email')}
          />
        </FormField>

        <FormField label="Service Location / Area" id="location" required error={errors.location?.message}>
          <input
            id="location"
            type="text"
            placeholder="e.g. Downtown Metro, Apt 4B"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('location')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Select Service" id="serviceType" required error={errors.serviceType?.message}>
          <select
            id="serviceType"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
            {...register('serviceType')}
          >
            {serviceOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Purifier Brand / Model (Optional)" id="productModel" error={errors.productModel?.message}>
          <input
            id="productModel"
            type="text"
            placeholder="e.g. AquaCare Grand RO"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('productModel')}
          />
        </FormField>
      </div>

      <FormField label="Preferred Service Date (Optional)" id="preferredDate" error={errors.preferredDate?.message}>
        <input
          id="preferredDate"
          type="date"
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
          {...register('preferredDate')}
        />
      </FormField>

      <FormField label="Describe The Issue or Request" id="message" required error={errors.message?.message}>
        <textarea
          id="message"
          rows={3}
          placeholder="e.g. Water taste change, low water flow, filter change light blinking, or relocation request..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
          {...register('message')}
        />
      </FormField>

      <div className="flex items-start gap-2.5 mt-1">
        <input
          type="checkbox"
          id="agreeToTerms"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          {...register('agreeToTerms')}
        />
        <label htmlFor="agreeToTerms" className="text-xs text-slate-500 cursor-pointer select-none">
          I consent to AquaCare contacting me regarding this service request and understand that appointment timing will be confirmed by phone coordinator.
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-xs text-rose-600 -mt-2">{errors.agreeToTerms.message}</p>
      )}

      <div className="mt-2">
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Wrench className="w-4 h-4" />}
          sx={{
            backgroundColor: '#0284c7',
            '&:hover': { backgroundColor: '#0369a1' },
            py: 1.5,
            fontSize: '0.95rem',
          }}
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Service Request'}
        </Button>
      </div>
    </form>
  );
}
