import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { env } from '../config/env.js';

export default fp(async function authPlugin(fastify) {
  // Register Cookie plugin
  await fastify.register(fastifyCookie, {
    secret: env.COOKIE_SECRET,
    hook: 'onRequest',
  });

  // Register JWT plugin
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'admin_token',
      signed: false,
    },
    sign: {
      expiresIn: '7d',
    },
  });

  // Decorator to protect admin routes
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      // Check Bearer authorization header or cookie
      const authHeader = request.headers.authorization;
      const cookieToken = request.cookies?.admin_token;

      if (!authHeader && !cookieToken) {
        return reply.code(401).send({
          success: false,
          message: 'Authentication required. No session or token found.',
          errors: ['Unauthorized access.'],
        });
      }

      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
        errors: [err.message],
      });
    }
  });
});
