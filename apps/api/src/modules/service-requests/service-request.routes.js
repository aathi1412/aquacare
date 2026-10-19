import {
  createServiceRequest,
  getAdminServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
} from './service-request.controller.js';

export default async function serviceRequestRoutes(fastify) {
  // Public submission
  fastify.post('/', {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: '1 minute',
      },
    },
  }, createServiceRequest);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminServiceRequests);
  fastify.patch('/admin/:id', { preHandler: [fastify.authenticate] }, updateServiceRequestStatus);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteServiceRequest);
}
