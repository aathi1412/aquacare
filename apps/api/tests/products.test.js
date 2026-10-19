import { test } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/app.js';

test('GET /api/v1/products returns product list and pagination metadata', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/products?limit=2',
  });

  assert.strictEqual(response.statusCode, 200);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, true);
  assert.ok(Array.isArray(payload.data));
  assert.ok(payload.data.length > 0);
  assert.ok(payload.meta);
  assert.strictEqual(payload.meta.page, 1);
  assert.strictEqual(payload.meta.limit, 2);

  await app.close();
});

test('GET /api/v1/products/:slug returns single product with gallery and specifications', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/products/aquapure-grand-ro-uv-alkaline',
  });

  assert.strictEqual(response.statusCode, 200);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, true);
  assert.strictEqual(payload.data.slug, 'aquapure-grand-ro-uv-alkaline');
  assert.ok(Array.isArray(payload.data.images));
  assert.ok(Array.isArray(payload.data.specifications));
  assert.ok(payload.data.threeSixty);

  await app.close();
});

test('GET /api/v1/products/:slug returns 404 for nonexistent product', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/products/non-existent-purifier-12345',
  });

  assert.strictEqual(response.statusCode, 404);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, false);

  await app.close();
});
