import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async function rateLimitPlugin(fastify) {
  await fastify.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', 'localhost'],
    errorResponseBuilder: (request, context) => ({
      success: false,
      message: `Rate limit exceeded. Please try again after ${context.after}.`,
      errors: ['Too many requests.'],
    }),
  });
});
