import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../../schemas/contact.schema.js';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import FormField from '../common/FormField.jsx';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      setIsSuccess(true);
      addToast({
        type: 'success',
        message: 'Message sent! Our support team will respond shortly.',
      });
      reset();
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-emerald-50/60 border border-emerald-200 rounded-3xl text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h4>
        <p className="text-slate-600 text-sm max-w-sm leading-relaxed mb-6">
          Thank you for contacting AquaCare. Our customer support desk will review your message and reply via email or phone.
        </p>
        <Button
          variant="outlined"
          onClick={() => setIsSuccess(false)}
          sx={{ borderColor: '#cbd5e1', color: '#0f172a' }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Your Name" id="name" required error={errors.name?.message}>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('name')}
          />
        </FormField>

        <FormField label="Phone Number" id="phone" required error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98555-30199"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('phone')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Email Address" id="email" required error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('email')}
          />
        </FormField>

        <FormField label="Subject" id="subject" required error={errors.subject?.message}>
          <input
            id="subject"
            type="text"
            placeholder="e.g. Purifier Enquiry or Service Query"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            {...register('subject')}
          />
        </FormField>
      </div>

      <FormField label="Your Message" id="message" required error={errors.message?.message}>
        <textarea
          id="message"
          rows={4}
          placeholder="How can our water specialists assist you today?"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
          {...register('message')}
        />
      </FormField>

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Send className="w-4 h-4" />}
        sx={{
          backgroundColor: '#0284c7',
          '&:hover': { backgroundColor: '#0369a1' },
          py: 1.5,
          fontSize: '0.95rem',
          mt: 2,
        }}
      >
        {isSubmitting ? 'Sending Message...' : 'Send Message'}
      </Button>
    </form>
  );
}
