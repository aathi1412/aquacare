import {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from './faq.controller.js';

export default async function faqRoutes(fastify) {
  // Public
  fastify.get('/', getFAQs);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminFAQs);
  fastify.post('/admin', { preHandler: [fastify.authenticate] }, createFAQ);
  fastify.put('/admin/:id', { preHandler: [fastify.authenticate] }, updateFAQ);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteFAQ);
}
