import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const frameSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    categoryName: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
    purificationTechnology: {
      type: String,
      default: 'RO + UV + UF',
    },
    capacity: {
      type: String,
      default: '',
    },
    warranty: {
      type: String,
      default: '1 Year Comprehensive Warranty',
    },
    installationInfo: {
      type: String,
      default: 'Free standard installation included with certified technician.',
    },
    price: {
      type: Number,
      default: null,
    },
    priceDisplayMode: {
      type: String,
      enum: ['request_price', 'show_price', 'hidden'],
      default: 'request_price',
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    threeSixty: {
      isEnabled: { type: Boolean, default: false },
      frames: { type: [frameSchema], default: [] },
      frameCount: { type: Number, default: 0 },
      sensitivity: { type: Number, default: 1 },
    },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', shortDescription: 'text', fullDescription: 'text' });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
