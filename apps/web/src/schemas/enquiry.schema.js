import { z } from 'zod';

export const enquirySchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Please enter a valid phone number (min 7 digits)'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  sourcePage: z.string().optional(),
  product: z.string().optional(),
  productName: z.string().optional(),
});
