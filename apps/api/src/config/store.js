import bcrypt from 'bcryptjs';
import { isDbConnected } from './db.js';
import { User } from '../modules/auth/auth.model.js';
import { Category } from '../modules/categories/category.model.js';
import { Product } from '../modules/products/product.model.js';
import { Service } from '../modules/services/service.model.js';
import { ProductEnquiry } from '../modules/enquiries/enquiry.model.js';
import { ServiceRequest } from '../modules/service-requests/service-request.model.js';
import { ContactMessage } from '../modules/contact/contact.model.js';
import { FAQ } from '../modules/faqs/faq.model.js';
import { SiteSettings } from '../modules/settings/settings.model.js';
import {
  defaultCategories,
  defaultProducts,
  defaultServices,
  defaultFAQs,
  defaultSettings,
} from './seed-data.js';

// In-Memory fallback store
const inMemoryStore = {
  users: [
    {
      _id: '671200000000000000000000',
      name: 'Admin AquaCare',
      email: 'admin@aquaCare.com',
      passwordHash: bcrypt.hashSync('Admin@123456', 10),
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  categories: JSON.parse(JSON.stringify(defaultCategories)),
  products: JSON.parse(JSON.stringify(defaultProducts)),
  services: JSON.parse(JSON.stringify(defaultServices)),
  enquiries: [
    {
      _id: '671200000000000000000401',
      customerName: 'Sarah Jenkins',
      phone: '+1 555-234-5678',
      email: 'sarah.j@example.com',
      product: '671200000000000000000101',
      productName: 'AquaCare Grand RO + UV + Alkaline',
      message: 'Interested in getting this installed for our new apartment. Does it come with a pressure reducing valve?',
      sourcePage: '/products/aquaCare-grand-ro-uv-alkaline',
      status: 'New',
      internalNotes: 'Follow up by tomorrow afternoon.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      _id: '671200000000000000000402',
      customerName: 'David Lee',
      phone: '+1 555-876-5432',
      email: 'd.lee@example.com',
      product: '671200000000000000000102',
      productName: 'AquaCare Under-Sink Ultra-Slim RO',
      message: 'Please send quote for under-sink RO with installation.',
      sourcePage: '/products/aquaCare-under-sink-ultra-slim-ro',
      status: 'Contacted',
      internalNotes: 'Sent quotation via email.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ],
  serviceRequests: [
    {
      _id: '671200000000000000000501',
      customerName: 'Marcus Vance',
      phone: '+1 555-345-6789',
      email: 'marcus.v@example.com',
      location: 'Downtown Metro, Block B',
      serviceType: 'Routine Filter Replacement & Sanitization',
      productModel: 'AquaCare Grand RO',
      preferredDate: '2026-10-25',
      message: 'Water flow has decreased slightly, filter replacement alert is blinking red.',
      status: 'Scheduled',
      internalNotes: 'Assigned to Technician Alex for 10am slot.',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  contactMessages: [
    {
      _id: '671200000000000000000601',
      name: 'Jennifer Miller',
      phone: '+1 555-456-7890',
      email: 'jennifer.m@example.com',
      subject: 'Commercial Purifier for Dental Clinic',
      message: 'We are expanding our clinic and need medical-grade pure water dispenser. Can your commercial team reach out?',
      status: 'New',
      internalNotes: 'High priority commercial lead.',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
  faqs: JSON.parse(JSON.stringify(defaultFAQs)),
  settings: JSON.parse(JSON.stringify(defaultSettings)),
};

export const repository = {
  // Check live DB status
  isLive() {
    return isDbConnected();
  },

  // USERS / AUTH
  users: {
    async findByEmail(email) {
      if (isDbConnected()) {
        return User.findOne({ email: email.toLowerCase() });
      }
      return inMemoryStore.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || null;
    },
    async findById(id) {
      if (isDbConnected()) {
        return User.findById(id).select('-passwordHash');
      }
      const u = inMemoryStore.users.find((user) => user._id.toString() === id.toString());
      if (!u) return null;
      const { passwordHash, ...rest } = u;
      return rest;
    },
    async create(userData) {
      if (isDbConnected()) {
        const u = new User(userData);
        return u.save();
      }
      const newUser = {
        _id: 'usr_' + Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.users.push(newUser);
      return newUser;
    },
  },

  // CATEGORIES
  categories: {
    async find(filter = {}) {
      if (isDbConnected()) {
        return Category.find(filter).sort({ displayOrder: 1, name: 1 });
      }
      return inMemoryStore.categories
        .filter((c) => {
          if (filter.isPublished !== undefined && c.isPublished !== filter.isPublished) return false;
          return true;
        })
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    },
    async findBySlug(slug) {
      if (isDbConnected()) {
        return Category.findOne({ slug });
      }
      return inMemoryStore.categories.find((c) => c.slug === slug) || null;
    },
    async findById(id) {
      if (isDbConnected()) {
        return Category.findById(id);
      }
      return inMemoryStore.categories.find((c) => c._id.toString() === id.toString()) || null;
    },
    async create(data) {
      if (isDbConnected()) {
        const c = new Category(data);
        return c.save();
      }
      const newCat = {
        _id: 'cat_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.categories.push(newCat);
      return newCat;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return Category.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.categories.findIndex((c) => c._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.categories[idx] = {
        ...inMemoryStore.categories[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.categories[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return Category.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.categories.findIndex((c) => c._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.categories.splice(idx, 1);
      return removed;
    },
  },

  // PRODUCTS
  products: {
    async find({ filter = {}, page = 1, limit = 12, sort = { createdAt: -1 } }) {
      if (isDbConnected()) {
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(filter);
        const data = await Product.find(filter)
          .populate('category', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit);
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
      }

      let items = [...inMemoryStore.products];
      if (filter.isPublished !== undefined) {
        items = items.filter((p) => p.isPublished === filter.isPublished);
      }
      if (filter.isFeatured !== undefined) {
        items = items.filter((p) => p.isFeatured === filter.isFeatured);
      }
      if (filter.category) {
        items = items.filter(
          (p) =>
            p.category?.toString() === filter.category.toString() ||
            p.categoryName === filter.category
        );
      }
      if (filter.$text && filter.$text.$search) {
        const query = filter.$text.$search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            (p.fullDescription && p.fullDescription.toLowerCase().includes(query))
        );
      } else if (filter.search) {
        const query = filter.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            (p.fullDescription && p.fullDescription.toLowerCase().includes(query))
        );
      }

      const total = items.length;
      const skip = (page - 1) * limit;
      const paged = items.slice(skip, skip + limit);
      return { data: paged, total, page, limit, pages: Math.ceil(total / limit) };
    },
    async findBySlug(slug) {
      if (isDbConnected()) {
        return Product.findOne({ slug }).populate('category', 'name slug');
      }
      return inMemoryStore.products.find((p) => p.slug === slug) || null;
    },
    async findById(id) {
      if (isDbConnected()) {
        return Product.findById(id).populate('category', 'name slug');
      }
      return inMemoryStore.products.find((p) => p._id.toString() === id.toString()) || null;
    },
    async countDocuments(filter = {}) {
      if (isDbConnected()) {
        return Product.countDocuments(filter);
      }
      return inMemoryStore.products.filter((p) => {
        if (filter.isPublished !== undefined && p.isPublished !== filter.isPublished) return false;
        if (filter.category && p.category?.toString() !== filter.category.toString()) return false;
        return true;
      }).length;
    },
    async create(data) {
      if (isDbConnected()) {
        const p = new Product(data);
        return p.save();
      }
      const newProduct = {
        _id: 'prod_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.products.unshift(newProduct);
      return newProduct;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return Product.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.products.findIndex((p) => p._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.products[idx] = {
        ...inMemoryStore.products[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.products[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return Product.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.products.findIndex((p) => p._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.products.splice(idx, 1);
      return removed;
    },
  },

  // SERVICES
  services: {
    async find(filter = {}) {
      if (isDbConnected()) {
        return Service.find(filter).sort({ displayOrder: 1 });
      }
      return inMemoryStore.services
        .filter((s) => {
          if (filter.isPublished !== undefined && s.isPublished !== filter.isPublished) return false;
          return true;
        })
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    },
    async findBySlug(slug) {
      if (isDbConnected()) {
        return Service.findOne({ slug });
      }
      return inMemoryStore.services.find((s) => s.slug === slug) || null;
    },
    async findById(id) {
      if (isDbConnected()) {
        return Service.findById(id);
      }
      return inMemoryStore.services.find((s) => s._id.toString() === id.toString()) || null;
    },
    async create(data) {
      if (isDbConnected()) {
        const s = new Service(data);
        return s.save();
      }
      const newService = {
        _id: 'srv_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.services.push(newService);
      return newService;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return Service.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.services.findIndex((s) => s._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.services[idx] = {
        ...inMemoryStore.services[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.services[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return Service.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.services.findIndex((s) => s._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.services.splice(idx, 1);
      return removed;
    },
  },

  // ENQUIRIES
  enquiries: {
    async find({ filter = {}, page = 1, limit = 20, sort = { createdAt: -1 } }) {
      if (isDbConnected()) {
        const skip = (page - 1) * limit;
        const total = await ProductEnquiry.countDocuments(filter);
        const data = await ProductEnquiry.find(filter)
          .populate('product', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit);
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
      }
      let items = [...inMemoryStore.enquiries];
      if (filter.status) {
        items = items.filter((e) => e.status === filter.status);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        items = items.filter(
          (e) =>
            e.customerName.toLowerCase().includes(q) ||
            e.phone.includes(q) ||
            (e.email && e.email.toLowerCase().includes(q)) ||
            (e.productName && e.productName.toLowerCase().includes(q))
        );
      }
      const total = items.length;
      const skip = (page - 1) * limit;
      return { data: items.slice(skip, skip + limit), total, page, limit, pages: Math.ceil(total / limit) };
    },
    async findById(id) {
      if (isDbConnected()) {
        return ProductEnquiry.findById(id);
      }
      return inMemoryStore.enquiries.find((e) => e._id.toString() === id.toString()) || null;
    },
    async countDocuments(filter = {}) {
      if (isDbConnected()) {
        return ProductEnquiry.countDocuments(filter);
      }
      return inMemoryStore.enquiries.filter((e) => {
        if (filter.status && e.status !== filter.status) return false;
        return true;
      }).length;
    },
    async create(data) {
      if (isDbConnected()) {
        const e = new ProductEnquiry(data);
        return e.save();
      }
      const newEnq = {
        _id: 'enq_' + Date.now(),
        ...data,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.enquiries.unshift(newEnq);
      return newEnq;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return ProductEnquiry.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.enquiries.findIndex((e) => e._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.enquiries[idx] = {
        ...inMemoryStore.enquiries[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.enquiries[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return ProductEnquiry.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.enquiries.findIndex((e) => e._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.enquiries.splice(idx, 1);
      return removed;
    },
  },

  // SERVICE REQUESTS
  serviceRequests: {
    async find({ filter = {}, page = 1, limit = 20, sort = { createdAt: -1 } }) {
      if (isDbConnected()) {
        const skip = (page - 1) * limit;
        const total = await ServiceRequest.countDocuments(filter);
        const data = await ServiceRequest.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit);
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
      }
      let items = [...inMemoryStore.serviceRequests];
      if (filter.status) {
        items = items.filter((r) => r.status === filter.status);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        items = items.filter(
          (r) =>
            r.customerName.toLowerCase().includes(q) ||
            r.phone.includes(q) ||
            r.serviceType.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q)
        );
      }
      const total = items.length;
      const skip = (page - 1) * limit;
      return { data: items.slice(skip, skip + limit), total, page, limit, pages: Math.ceil(total / limit) };
    },
    async findById(id) {
      if (isDbConnected()) {
        return ServiceRequest.findById(id);
      }
      return inMemoryStore.serviceRequests.find((r) => r._id.toString() === id.toString()) || null;
    },
    async countDocuments(filter = {}) {
      if (isDbConnected()) {
        return ServiceRequest.countDocuments(filter);
      }
      return inMemoryStore.serviceRequests.filter((r) => {
        if (filter.status && r.status !== filter.status) return false;
        return true;
      }).length;
    },
    async create(data) {
      if (isDbConnected()) {
        const r = new ServiceRequest(data);
        return r.save();
      }
      const newReq = {
        _id: 'req_' + Date.now(),
        ...data,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.serviceRequests.unshift(newReq);
      return newReq;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return ServiceRequest.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.serviceRequests.findIndex((r) => r._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.serviceRequests[idx] = {
        ...inMemoryStore.serviceRequests[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.serviceRequests[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return ServiceRequest.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.serviceRequests.findIndex((r) => r._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.serviceRequests.splice(idx, 1);
      return removed;
    },
  },

  // CONTACT MESSAGES
  contactMessages: {
    async find({ filter = {}, page = 1, limit = 20, sort = { createdAt: -1 } }) {
      if (isDbConnected()) {
        const skip = (page - 1) * limit;
        const total = await ContactMessage.countDocuments(filter);
        const data = await ContactMessage.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit);
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
      }
      let items = [...inMemoryStore.contactMessages];
      if (filter.status) {
        items = items.filter((m) => m.status === filter.status);
      }
      const total = items.length;
      const skip = (page - 1) * limit;
      return { data: items.slice(skip, skip + limit), total, page, limit, pages: Math.ceil(total / limit) };
    },
    async findById(id) {
      if (isDbConnected()) {
        return ContactMessage.findById(id);
      }
      return inMemoryStore.contactMessages.find((m) => m._id.toString() === id.toString()) || null;
    },
    async countDocuments(filter = {}) {
      if (isDbConnected()) {
        return ContactMessage.countDocuments(filter);
      }
      return inMemoryStore.contactMessages.filter((m) => {
        if (filter.status && m.status !== filter.status) return false;
        return true;
      }).length;
    },
    async create(data) {
      if (isDbConnected()) {
        const m = new ContactMessage(data);
        return m.save();
      }
      const newMsg = {
        _id: 'msg_' + Date.now(),
        ...data,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.contactMessages.unshift(newMsg);
      return newMsg;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return ContactMessage.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.contactMessages.findIndex((m) => m._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.contactMessages[idx] = {
        ...inMemoryStore.contactMessages[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.contactMessages[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return ContactMessage.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.contactMessages.findIndex((m) => m._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.contactMessages.splice(idx, 1);
      return removed;
    },
  },

  // FAQS
  faqs: {
    async find(filter = {}) {
      if (isDbConnected()) {
        return FAQ.find(filter).sort({ displayOrder: 1, createdAt: 1 });
      }
      return inMemoryStore.faqs
        .filter((f) => {
          if (filter.isPublished !== undefined && f.isPublished !== filter.isPublished) return false;
          if (filter.category && f.category !== filter.category) return false;
          return true;
        })
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    },
    async findById(id) {
      if (isDbConnected()) {
        return FAQ.findById(id);
      }
      return inMemoryStore.faqs.find((f) => f._id.toString() === id.toString()) || null;
    },
    async create(data) {
      if (isDbConnected()) {
        const f = new FAQ(data);
        return f.save();
      }
      const newFaq = {
        _id: 'faq_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.faqs.push(newFaq);
      return newFaq;
    },
    async findByIdAndUpdate(id, update) {
      if (isDbConnected()) {
        return FAQ.findByIdAndUpdate(id, update, { new: true });
      }
      const idx = inMemoryStore.faqs.findIndex((f) => f._id.toString() === id.toString());
      if (idx === -1) return null;
      inMemoryStore.faqs[idx] = {
        ...inMemoryStore.faqs[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.faqs[idx];
    },
    async findByIdAndDelete(id) {
      if (isDbConnected()) {
        return FAQ.findByIdAndDelete(id);
      }
      const idx = inMemoryStore.faqs.findIndex((f) => f._id.toString() === id.toString());
      if (idx === -1) return null;
      const [removed] = inMemoryStore.faqs.splice(idx, 1);
      return removed;
    },
  },

  // SETTINGS
  settings: {
    async getSettings() {
      if (isDbConnected()) {
        let s = await SiteSettings.findOne();
        if (!s) {
          s = await SiteSettings.create(defaultSettings);
        }
        return s;
      }
      return inMemoryStore.settings;
    },
    async updateSettings(update) {
      if (isDbConnected()) {
        let s = await SiteSettings.findOne();
        if (!s) {
          s = await SiteSettings.create({ ...defaultSettings, ...update });
        } else {
          Object.assign(s, update);
          await s.save();
        }
        return s;
      }
      inMemoryStore.settings = {
        ...inMemoryStore.settings,
        ...update,
        hero: { ...inMemoryStore.settings.hero, ...(update.hero || {}) },
        socialLinks: { ...inMemoryStore.settings.socialLinks, ...(update.socialLinks || {}) },
        footer: { ...inMemoryStore.settings.footer, ...(update.footer || {}) },
        updatedAt: new Date().toISOString(),
      };
      return inMemoryStore.settings;
    },
  },

  // STATS FOR DASHBOARD
  dashboard: {
    async getStats() {
      const isLive = isDbConnected();
      const [
        totalProducts,
        totalCategories,
        newEnquiries,
        pendingRequests,
        newMessages,
        recentEnquiriesRes,
        recentRequestsRes,
      ] = await Promise.all([
        repository.products.countDocuments({ isPublished: true }),
        isLive ? Category.countDocuments() : inMemoryStore.categories.length,
        repository.enquiries.countDocuments({ status: 'New' }),
        repository.serviceRequests.countDocuments({ status: 'New' }),
        repository.contactMessages.countDocuments({ status: 'New' }),
        repository.enquiries.find({ page: 1, limit: 5 }),
        repository.serviceRequests.find({ page: 1, limit: 5 }),
      ]);

      return {
        databaseMode: isLive ? 'MongoDB Atlas (Connected)' : 'Development / Local Fallback',
        metrics: {
          totalProducts,
          totalCategories,
          newEnquiries,
          pendingServiceRequests: pendingRequests,
          newContactMessages: newMessages,
        },
        recentEnquiries: recentEnquiriesRes.data,
        recentServiceRequests: recentRequestsRes.data,
      };
    },
  },
};
