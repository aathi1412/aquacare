import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import corsPlugin from './plugins/cors.js';
import helmetPlugin from './plugins/helmet.js';
import rateLimitPlugin from './plugins/rate-limit.js';
import authPlugin from './plugins/auth.js';
import cloudinaryPlugin from './plugins/cloudinary.js';
import errorHandlerPlugin from './plugins/error-handler.js';

import healthRoutes from './modules/health/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import productRoutes from './modules/products/product.routes.js';
import serviceRoutes from './modules/services/service.routes.js';
import enquiryRoutes from './modules/enquiries/enquiry.routes.js';
import serviceRequestRoutes from './modules/service-requests/service-request.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import faqRoutes from './modules/faqs/faq.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import mediaRoutes from './modules/media/media.routes.js';

export function buildApp(opts = {}) {
  const app = Fastify({
    logger: opts.logger ?? {
      level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    },
    trustProxy: true,
  });

  // Core Plugins
  app.register(corsPlugin);
  app.register(helmetPlugin);
  app.register(rateLimitPlugin);
  app.register(authPlugin);
  app.register(cloudinaryPlugin);
  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 24, // up to 24 files for 360 frames
    },
  });
  app.register(errorHandlerPlugin);

  // Health route
  app.register(healthRoutes, { prefix: '/api/v1' });

  // Modular API Routes under /api/v1
  app.register(async function apiRoutes(api) {
    api.register(authRoutes, { prefix: '/auth' });
    api.register(categoryRoutes, { prefix: '/categories' });
    api.register(productRoutes, { prefix: '/products' });
    api.register(serviceRoutes, { prefix: '/services' });
    api.register(enquiryRoutes, { prefix: '/enquiries' });
    api.register(serviceRequestRoutes, { prefix: '/service-requests' });
    api.register(contactRoutes, { prefix: '/contact' });
    api.register(faqRoutes, { prefix: '/faqs' });
    api.register(settingsRoutes, { prefix: '/settings' });
    api.register(dashboardRoutes, { prefix: '/dashboard' });
    api.register(mediaRoutes, { prefix: '/media' });
  }, { prefix: '/api/v1' });

  return app;
}
