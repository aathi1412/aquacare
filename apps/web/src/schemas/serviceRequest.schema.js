import { z } from 'zod';

export const serviceRequestSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Please enter a valid phone number (min 7 digits)'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  location: z.string().min(3, 'Please provide your address, city or service area'),
  serviceType: z.string().min(1, 'Please select a service type'),
  productModel: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().min(10, 'Please describe your request in at least 10 characters'),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the privacy policy to submit a request'),
});
