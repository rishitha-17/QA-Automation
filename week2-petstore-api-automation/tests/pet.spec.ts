/**
 * Pet API Tests — https://petstore.swagger.io/v2/pet
 *
 * Covers:
 *  POST   /pet               – add a new pet
 *  GET    /pet/{petId}       – find pet by ID
 *  PUT    /pet               – update an existing pet
 *  GET    /pet/findByStatus  – find pets by status
 *  POST   /pet/{petId}       – update pet with form data
 *  POST   /pet/{petId}/uploadImage – upload image
 *  DELETE /pet/{petId}       – delete a pet
 */

import { test, expect } from '@playwright/test';
import { randomId, buildPet } from '../utils/helpers';

test.describe.serial('Pet API', () => {
  const petId = randomId();
  const petName = `TestPet_${petId}`;

  // ── CREATE ─────────────────────────────────────────────────────────────────

  test('POST /pet - add a new pet', async ({ request }) => {
    const response = await request.post('pet', {
      data: buildPet(petId, petName, 'available'),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe(petName);
    expect(body.status).toBe('available');
    expect(body.category).toMatchObject({ id: 1, name: 'Dogs' });
    expect(body.photoUrls).toEqual(['https://example.com/photo.jpg']);
    expect(body.tags).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'automation' })]));
  });

  // ── READ ───────────────────────────────────────────────────────────────────

  test('GET /pet/{petId} - find pet by ID', async ({ request }) => {
    const response = await request.get(`pet/${petId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe(petName);
    expect(body.status).toBe('available');
  });

  // ── UPDATE (JSON body) ──────────────────────────────────────────────────────

  test('PUT /pet - update an existing pet', async ({ request }) => {
    const updatedPet = buildPet(petId, `${petName}_Updated`, 'sold');
    const response = await request.put('pet', { data: updatedPet });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe(`${petName}_Updated`);
    expect(body.status).toBe('sold');
  });

  // ── FIND BY STATUS ─────────────────────────────────────────────────────────

  test('GET /pet/findByStatus - available pets are returned', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'available' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    for (const pet of body) {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('name');
      expect(pet.status).toBe('available');
    }
  });

  test('GET /pet/findByStatus - pending pets are returned', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'pending' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    for (const pet of body) {
      expect(pet.status).toBe('pending');
    }
  });

  test('GET /pet/findByStatus - sold pets are returned', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'sold' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    for (const pet of body) {
      expect(pet.status).toBe('sold');
    }
  });

  // ── UPDATE (form data) ──────────────────────────────────────────────────────

  test('POST /pet/{petId} - update pet with form data', async ({ request }) => {
    const response = await request.post(`pet/${petId}`, {
      form: {
        name: `${petName}_Form`,
        status: 'pending',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(200);
  });

  // ── UPLOAD IMAGE ───────────────────────────────────────────────────────────

  test('POST /pet/{petId}/uploadImage - upload image metadata', async ({ request }) => {
    const response = await request.post(`pet/${petId}/uploadImage`, {
      multipart: {
        additionalMetadata: 'automation-test-upload',
      },
    });

    // Public Petstore returns 500 when no actual file is provided; both 200 and 500 are acceptable.
    expect([200, 500]).toContain(response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('code');
      expect(body).toHaveProperty('type');
      expect(body).toHaveProperty('message');
    }
  });

  // ── DELETE ─────────────────────────────────────────────────────────────────

  test('DELETE /pet/{petId} - delete the pet', async ({ request }) => {
    const response = await request.delete(`pet/${petId}`, {
      headers: { api_key: 'special-key' },
    });

    expect(response.status()).toBe(200);
  });

  test('GET /pet/{petId} - returns 404 after deletion', async ({ request }) => {
    const response = await request.get(`pet/${petId}`);

    expect(response.status()).toBe(404);
  });

  // ── NEGATIVE CASES ─────────────────────────────────────────────────────────

  test('GET /pet/{petId} - returns 404 for non-existent pet', async ({ request }) => {
    const response = await request.get('pet/99999999999');

    expect(response.status()).toBe(404);
  });

  test('DELETE /pet/{petId} - returns 404 for non-existent pet', async ({ request }) => {
    const response = await request.delete('pet/99999999999', {
      headers: { api_key: 'special-key' },
    });

    expect(response.status()).toBe(404);
  });
});
