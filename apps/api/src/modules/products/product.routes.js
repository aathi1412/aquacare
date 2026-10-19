import {
  getProducts,
  getProductBySlug,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  togglePublishProduct,
  deleteProduct,
  updateGallery,
  update360Viewer,
} from './product.controller.js';

export default async function productRoutes(fastify) {
  // Public
  fastify.get('/', getProducts);
  fastify.get('/:slug', getProductBySlug);

  // Admin Protected
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, getAdminProducts);
  fastify.get('/admin/:id', { preHandler: [fastify.authenticate] }, getAdminProductById);
  fastify.post('/admin', { preHandler: [fastify.authenticate] }, createProduct);
  fastify.put('/admin/:id', { preHandler: [fastify.authenticate] }, updateProduct);
  fastify.patch('/admin/:id/publish', { preHandler: [fastify.authenticate] }, togglePublishProduct);
  fastify.delete('/admin/:id', { preHandler: [fastify.authenticate] }, deleteProduct);
  fastify.put('/admin/:id/gallery', { preHandler: [fastify.authenticate] }, updateGallery);
  fastify.put('/admin/:id/360', { preHandler: [fastify.authenticate] }, update360Viewer);
}
