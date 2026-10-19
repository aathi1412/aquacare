import { test } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/app.js';

test('GET /api/v1/health returns 200 with service status', async (t) => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/health',
  });

  assert.strictEqual(response.statusCode, 200);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, true);
  assert.strictEqual(payload.status, 'healthy');
  assert.ok(payload.services);
  assert.strictEqual(payload.services.api, 'online');

  await app.close();
});
