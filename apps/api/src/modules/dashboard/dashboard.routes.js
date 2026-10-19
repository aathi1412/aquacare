import { getDashboardStats } from './dashboard.controller.js';

export default async function dashboardRoutes(fastify) {
  fastify.get('/stats', {
    preHandler: [fastify.authenticate],
  }, getDashboardStats);
}
