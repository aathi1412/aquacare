import {
  getCategories,
  getCategoryBySlug,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './category.controller.js';

export default async function categoryRoutes(fastify) {
  // Public
  fastify.get('/', getCategories);
  fastify.get('/:slug', getCategoryBySlug);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminCategories);
  fastify.post('/admin', { preHandler: [fastify.authenticate] }, createCategory);
  fastify.put('/admin/:id', { preHandler: [fastify.authenticate] }, updateCategory);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteCategory);
}
