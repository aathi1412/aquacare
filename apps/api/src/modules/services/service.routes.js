import {
  getServices,
  getServiceBySlug,
  getAdminServices,
  createService,
  updateService,
  deleteService,
} from './service.controller.js';

export default async function serviceRoutes(fastify) {
  // Public
  fastify.get('/', getServices);
  fastify.get('/:slug', getServiceBySlug);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminServices);
  fastify.post('/admin', { preHandler: [fastify.authenticate] }, createService);
  fastify.put('/admin/:id', { preHandler: [fastify.authenticate] }, updateService);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteService);
}
