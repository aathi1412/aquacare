import { uploadImage, upload360Frames, deleteMedia } from './media.controller.js';

export default async function mediaRoutes(fastify) {
  // Admin Protected endpoints
  fastify.post('/upload', { preHandler: [fastify.authenticate] }, uploadImage);
  fastify.post('/upload-360-frames', { preHandler: [fastify.authenticate] }, upload360Frames);
  fastify.delete('/delete', { preHandler: [fastify.authenticate] }, deleteMedia);
}
