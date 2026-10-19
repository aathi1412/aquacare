import {
  getPublicSettings,
  getAdminSettings,
  updateAdminSettings,
} from './settings.controller.js';

export default async function settingsRoutes(fastify) {
  // Public
  fastify.get('/public', getPublicSettings);

  // Admin Protected
  fastify.get('/admin', { preHandler: [fastify.authenticate] }, getAdminSettings);
  fastify.put('/admin', { preHandler: [fastify.authenticate] }, updateAdminSettings);
}
