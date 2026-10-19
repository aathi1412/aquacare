import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';

export default fp(async function helmetPlugin(fastify) {
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disabled for API to avoid breaking swagger / cross-origin media
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
});
