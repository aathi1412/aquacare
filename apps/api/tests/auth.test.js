import { test } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/app.js';

test('POST /api/v1/auth/login rejects invalid credentials', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      email: 'wrong@aquapure.com',
      password: 'BadPassword123',
    },
  });

  assert.strictEqual(response.statusCode, 401);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, false);

  await app.close();
});

test('POST /api/v1/auth/login succeeds with valid admin credentials', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      email: 'admin@aquapure.com',
      password: 'Admin@123456',
    },
  });

  assert.strictEqual(response.statusCode, 200);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, true);
  assert.ok(payload.data.token);
  assert.strictEqual(payload.data.user.email, 'admin@aquapure.com');

  // Verify protected /auth/me route with Bearer token
  const meResponse = await app.inject({
    method: 'GET',
    url: '/api/v1/auth/me',
    headers: {
      Authorization: `Bearer ${payload.data.token}`,
    },
  });

  assert.strictEqual(meResponse.statusCode, 200);
  const mePayload = JSON.parse(meResponse.payload);
  assert.strictEqual(mePayload.success, true);
  assert.strictEqual(mePayload.data.email, 'admin@aquapure.com');

  await app.close();
});
