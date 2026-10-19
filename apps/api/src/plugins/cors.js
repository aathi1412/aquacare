import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../config/env.js';

export default fp(async function corsPlugin(fastify) {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, postman, same origin)
      if (!origin) return cb(null, true);

      // Support comma-separated origins or specific origin
      const allowedOrigins = [
        env.CORS_ORIGIN,
        "http://localhost:7777",
        "http://localhost:5173",
      ];
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return cb(null, true);
      }
      return cb(new Error('CORS Not Allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
});
