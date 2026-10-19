import {
  createEnquiry,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from './enquiry.controller.js';

export default async function enquiryRoutes(fastify) {
  // Public submission
  fastify.post('/', {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: '1 minute',
      },
    },
  }, createEnquiry);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminEnquiries);
  fastify.patch('/admin/:id', { preHandler: [fastify.authenticate] }, updateEnquiryStatus);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteEnquiry);
}
