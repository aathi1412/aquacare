import {
  createContactMessage,
  getAdminContactMessages,
  updateContactMessage,
  deleteContactMessage,
} from './contact.controller.js';

export default async function contactRoutes(fastify) {
  // Public
  fastify.post('/', {
    config: {
      rateLimit: {
        max: 15,
        timeWindow: '1 minute',
      },
    },
  }, createContactMessage);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminContactMessages);
  fastify.patch('/admin/:id', { preHandler: [fastify.authenticate] }, updateContactMessage);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteContactMessage);
}
