import fp from 'fastify-plugin';

export default fp(async function errorHandlerPlugin(fastify) {
  // Global 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      message: `Endpoint ${request.method} ${request.url} not found.`,
      errors: ['Route not found'],
    });
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    // Validation errors
    if (error.validation) {
      return reply.code(400).send({
        success: false,
        message: 'Validation failed.',
        errors: error.validation.map((err) => `${err.instancePath || 'field'} ${err.message}`),
      });
    }

    // Rate limit errors
    if (error.statusCode === 429) {
      return reply.code(429).send({
        success: false,
        message: error.message || 'Too many requests.',
        errors: ['Rate limit exceeded.'],
      });
    }

    // JWT errors
    if (error.statusCode === 401 || error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
      return reply.code(401).send({
        success: false,
        message: 'Unauthorized access.',
        errors: [error.message],
      });
    }

    const statusCode = error.statusCode && error.statusCode >= 400 && error.statusCode < 600
      ? error.statusCode
      : 500;

    return reply.code(statusCode).send({
      success: false,
      message: statusCode === 500 ? 'An unexpected server error occurred.' : error.message,
      errors: process.env.NODE_ENV === 'development' ? [error.message] : ['Internal server error.'],
    });
  });
});
