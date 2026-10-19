import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'AquaCare',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Advanced Purification for Pure, Refreshing Living',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#0284c7',
    },
    phone: {
      type: String,
      default: '+91 99887 76655',
    },
    email: {
      type: String,
      default: 'support@aquaCare.com',
    },
    whatsapp: {
      type: String,
      default: '+919988776655',
    },
    address: {
      type: String,
      default: 'No 6 Main road, Malumichampatti, Coimbatore',
    },
    serviceArea: {
      type: String,
      default: 'Coimbatore & Surrounding Regions (Same-Day Response)',
    },
    businessHours: {
      type: String,
      default: 'Mon - Sat: 8:00 AM - 7:00 PM | Sun: Emergency Support',
    },
    hero: {
      title: {
        type: String,
        default: 'Experience Pure, Healthy Water Every Day',
      },
      subtitle: {
        type: String,
        default: 'Industry-leading RO + UV + UF purification systems with complimentary certified installation and comprehensive maintenance plans.',
      },
      ctaText: {
        type: String,
        default: 'Explore Purifiers',
      },
      ctaLink: {
        type: String,
        default: '/products',
      },
      secondaryCtaText: {
        type: String,
        default: 'Book a Service',
      },
      secondaryCtaLink: {
        type: String,
        default: '/services',
      },
      heroImage: {
        type: String,
        default: 'https://res.cloudinary.com/mnedzlvg/image/upload/v1792398545/PDP_1_de97f82356.png',
      },
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
    },
    footer: {
      aboutText: {
        type: String,
        default: 'AquaCare provides residential and commercial water purification solutions, expert installation, routine filter replacement, and prompt AMC servicing.',
      },
      copyrightText: {
        type: String,
        default: '© 2026 AquaCare Solutions. All rights reserved.',
      },
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', settingsSchema);
