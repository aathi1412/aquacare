import { create } from 'zustand';
import api from '../services/api.js';

export const useSettingsStore = create((set) => ({
  settings: {
    businessName: 'AquaCare',
    tagline: 'Pure Water, Healthy Living',
    phone: '+91 99887 76655',
    email: 'support@aquacare.com',
    whatsapp: '+91 99887 76655',
    address: 'No 6 Main road, Malumichampatti, Coimbatore',
    serviceArea: 'Coimbatore & Surrounding Regions',
    businessHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    hero: {
      title: 'Experience Pure, Healthy Water Every Day',
      subtitle: 'Industry-leading RO + UV + UF purification systems with complimentary certified installation and comprehensive maintenance plans.',
      ctaText: 'Explore Purifiers',
      ctaLink: '/products',
      secondaryCtaText: 'Book a Service',
      secondaryCtaLink: '/services',
      heroImage: 'https://res.cloudinary.com/mnedzlvg/image/upload/v1792398545/PDP_1_de97f82356.png',
    },
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      linkedin: 'https://linkedin.com',
    },
    footer: {
      aboutText: 'AquaCare provides residential and commercial water purification solutions, expert installation, routine filter replacement, and prompt AMC servicing.',
      copyrightText: '© 2026 AquaCare Solutions. All rights reserved.',
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2009456.143285425!2d76.65189653256972!3d10.36433592508963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00ab4f6847417d%3A0x3aebf457c00782a!2sAqua%20Care!5e0!3m2!1sen!2sin!4v1792402639943!5m2!1sen!2sin',
  },
  isLoading: false,

  fetchPublicSettings: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/settings/public');
      if (res.data) {
        set({ settings: res.data, isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
