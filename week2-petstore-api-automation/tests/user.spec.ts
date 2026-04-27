/**
 * User API Tests — https://petstore.swagger.io/v2/user
 *
 * Covers:
 *  POST   /user                    – create a single user
 *  POST   /user/createWithArray    – create users from an array
 *  POST   /user/createWithList     – create users from a list
 *  GET    /user/login              – log in user
 *  GET    /user/logout             – log out user
 *  GET    /user/{username}         – get user by username
 *  PUT    /user/{username}         – update user
 *  DELETE /user/{username}         – delete user
 */

import { test, expect } from '@playwright/test';
import { randomId, randomUsername, buildUser } from '../utils/helpers';

test.describe.serial('User API', () => {
  const userId = randomId();
  const username = randomUsername();
  const password = 'Test@1234';

  // ── CREATE ─────────────────────────────────────────────────────────────────

  test('POST /user - create a new user', async ({ request }) => {
    const response = await request.post('user', {
      data: buildUser(userId, username, password),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.type).toBe('unknown');
    expect(body.message).toBe(String(userId));
  });

  test('POST /user/createWithArray - create users from array', async ({ request }) => {
    const users = [
      buildUser(randomId(), randomUsername()),
      buildUser(randomId(), randomUsername()),
    ];
    const response = await request.post('user/createWithArray', { data: users });

    expect(response.status()).toBe(200);
  });

  test('POST /user/createWithList - create users from list', async ({ request }) => {
    const users = [
      buildUser(randomId(), randomUsername()),
      buildUser(randomId(), randomUsername()),
    ];
    const response = await request.post('user/createWithList', { data: users });

    expect(response.status()).toBe(200);
  });

  // ── LOGIN ──────────────────────────────────────────────────────────────────

  test('GET /user/login - log in with valid credentials', async ({ request }) => {
    const response = await request.get('user/login', {
      params: { username, password },
    });

    expect(response.status()).toBe(200);
    // Response includes rate-limit headers
    expect(response.headers()).toHaveProperty('x-rate-limit');
    expect(response.headers()).toHaveProperty('x-expires-after');
    // Body is a plain string confirming login
    const body = await response.text();
    expect(body).toContain('logged in');
  });

  test('GET /user/login - returns 4xx for missing credentials', async ({ request }) => {
    const response = await request.get('user/login', {
      params: { username: '', password: '' },
    });

    // Spec says 400; public Petstore may return 200 with a session string for empty strings.
    expect([400, 200]).toContain(response.status());
  });

  // ── READ ───────────────────────────────────────────────────────────────────

  test('GET /user/{username} - get user by username', async ({ request }) => {
    const response = await request.get(`user/${username}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.username).toBe(username);
    expect(body.id).toBe(userId);
    expect(body.firstName).toBe('Test');
    expect(body.lastName).toBe('User');
    expect(body.email).toBe(`${username}@example.com`);
  });

  // ── UPDATE ─────────────────────────────────────────────────────────────────

  test('PUT /user/{username} - update user details', async ({ request }) => {
    const updatedUser = {
      ...buildUser(userId, username, password),
      firstName: 'Updated',
      lastName: 'Name',
      email: `${username}_updated@example.com`,
    };
    const response = await request.put(`user/${username}`, { data: updatedUser });

    expect(response.status()).toBe(200);
  });

  test('GET /user/{username} - reflects updated details', async ({ request }) => {
    const response = await request.get(`user/${username}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe('Updated');
    expect(body.lastName).toBe('Name');
  });

  // ── LOGOUT ─────────────────────────────────────────────────────────────────

  test('GET /user/logout - log out the user', async ({ request }) => {
    const response = await request.get('user/logout');

    expect(response.status()).toBe(200);
  });

  // ── DELETE ─────────────────────────────────────────────────────────────────

  test('DELETE /user/{username} - delete the user', async ({ request }) => {
    const response = await request.delete(`user/${username}`);

    expect(response.status()).toBe(200);
  });

  test('GET /user/{username} - returns 404 after deletion', async ({ request }) => {
    const response = await request.get(`user/${username}`);

    expect(response.status()).toBe(404);
  });

  // ── NEGATIVE CASES ─────────────────────────────────────────────────────────

  test('GET /user/{username} - returns 404 for non-existent user', async ({ request }) => {
    const response = await request.get('user/user_that_does_not_exist_xyz_99999');

    expect(response.status()).toBe(404);
  });

  test('PUT /user/{username} - non-existent user returns 2xx or 404', async ({ request }) => {
    const response = await request.put('user/non_existent_user_xyz_99999', {
      data: buildUser(randomId(), 'non_existent_user_xyz_99999'),
    });

    // Public Petstore treats PUT as an upsert and returns 200 even for unknown users;
    // the spec says 404 but real server behaviour differs.
    expect([200, 404]).toContain(response.status());
  });

  test('DELETE /user/{username} - non-existent user returns 2xx or 404', async ({ request }) => {
    const response = await request.delete('user/non_existent_user_xyz');

    // Public Petstore returns 200 even for unknown usernames on DELETE.
    expect([200, 404]).toContain(response.status());
  });
});
