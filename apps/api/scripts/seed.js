import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { User } from '../src/modules/auth/auth.model.js';
import { Category } from '../src/modules/categories/category.model.js';
import { Product } from '../src/modules/products/product.model.js';
import { Service } from '../src/modules/services/service.model.js';
import { FAQ } from '../src/modules/faqs/faq.model.js';
import { SiteSettings } from '../src/modules/settings/settings.model.js';
import {
  defaultCategories,
  defaultProducts,
  defaultServices,
  defaultFAQs,
  defaultSettings,
} from '../src/config/seed-data.js';

async function seed() {
  console.log('--- AquaCare Seed Script Starting ---');
  console.log(`Connecting to MongoDB URI: ${env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB successfully.');

    // 1. Bootstrap Admin
    console.log('Checking Admin Account...');
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      await User.create({
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: 'admin',
        isActive: true,
      });
      console.log(`✓ Admin user created: ${env.ADMIN_EMAIL}`);
    } else {
      console.log(`✓ Admin user already exists: ${env.ADMIN_EMAIL}`);
    }

    // 2. Seed Categories
    console.log('Seeding Categories...');
    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, _id: new mongoose.Types.ObjectId(cat._id) },
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Seeded ${defaultCategories.length} categories.`);

    // 3. Seed Products
    console.log('Seeding Products...');
    for (const prod of defaultProducts) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        {
          ...prod,
          _id: new mongoose.Types.ObjectId(prod._id),
          category: new mongoose.Types.ObjectId(prod.category),
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Seeded ${defaultProducts.length} products with specifications and gallery frames.`);

    // 4. Seed Services
    console.log('Seeding Services...');
    for (const srv of defaultServices) {
      await Service.findOneAndUpdate(
        { slug: srv.slug },
        { ...srv, _id: new mongoose.Types.ObjectId(srv._id) },
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Seeded ${defaultServices.length} services.`);

    // 5. Seed FAQs
    console.log('Seeding FAQs...');
    for (const faq of defaultFAQs) {
      await FAQ.findOneAndUpdate(
        { question: faq.question },
        { ...faq, _id: new mongoose.Types.ObjectId(faq._id) },
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Seeded ${defaultFAQs.length} FAQs.`);

    // 6. Seed SiteSettings
    console.log('Seeding Site Settings...');
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create(defaultSettings);
      console.log('✓ Default site settings initialized.');
    } else {
      console.log('✓ Site settings already present.');
    }

    console.log('--- Database Seeding Complete! ---');
  } catch (error) {
    console.error('Seed script error:', error.message);
    console.log('Note: If MongoDB Atlas is not yet reachable, the application also contains an in-memory fallback layer to allow local evaluation.');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
