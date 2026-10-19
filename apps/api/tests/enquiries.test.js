import { test } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/app.js';

test('POST /api/v1/enquiries validates required fields', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/enquiries',
    payload: {
      customerName: '',
      phone: '',
      message: '',
    },
  });

  assert.strictEqual(response.statusCode, 400);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, false);

  await app.close();
});

test('POST /api/v1/enquiries successfully creates an enquiry', async () => {
  const app = buildApp({ logger: false });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/enquiries',
    payload: {
      customerName: 'Robert Vance',
      phone: '+1 555-987-6543',
      email: 'robert.v@example.com',
      message: 'Interested in annual service contract for home purifier.',
      sourcePage: '/services',
    },
  });

  assert.strictEqual(response.statusCode, 201);
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.success, true);
  assert.strictEqual(payload.data.customerName, 'Robert Vance');
  assert.strictEqual(payload.data.status, 'New');

  await app.close();
});
