import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    productModel: {
      type: String,
      default: '',
      trim: true,
    },
    preferredDate: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'New',
      index: true,
    },
    internalNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceRequest =
  mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);
