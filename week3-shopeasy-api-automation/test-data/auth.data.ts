import type { LoginRequest, RegisterRequest } from '../src/types/api.types';

export const validLogin: LoginRequest = {
  email: 'admin@shopeasy.com',
  password: 'password123',
};

export const invalidPasswordLogin: LoginRequest = {
  email: 'admin@shopeasy.com',
  password: 'wrongpassword',
};

export const nonExistentUserLogin: LoginRequest = {
  email: 'ghost@shopeasy.com',
  password: 'password123',
};

export const missingEmailLogin: Partial<LoginRequest> = {
  password: 'password123',
};

export const missingPasswordLogin: Partial<LoginRequest> = {
  email: 'admin@shopeasy.com',
};

export const emptyBodyLogin: Partial<LoginRequest> = {};

export const validRegistration: RegisterRequest = {
  email: `newuser_${Date.now()}@shopeasy.com`,
  password: 'newpass123',
  name: 'New User',
};

export const duplicateRegistration: RegisterRequest = {
  email: 'admin@shopeasy.com',
  password: 'password123',
  name: 'Admin Duplicate',
};

export const missingNameRegistration: Partial<RegisterRequest> = {
  email: `partial_${Date.now()}@shopeasy.com`,
  password: 'pass123',
};

export const missingEmailRegistration: Partial<RegisterRequest> = {
  password: 'pass123',
  name: 'No Email User',
};

export const missingPasswordRegistration: Partial<RegisterRequest> = {
  email: `nopwd_${Date.now()}@shopeasy.com`,
  name: 'No Password User',
};

// ── Edge-case / boundary login payloads ──────────────────────────────────────

export const invalidEmailFormatLogin = {
  email: 'notanemail',
  password: 'password123',
};

export const whitespaceEmailLogin = {
  email: '   ',
  password: 'password123',
};

export const whitespacePasswordLogin = {
  email: 'admin@shopeasy.com',
  password: '   ',
};

export const sqlInjectionLogin = {
  email: "' OR '1'='1",
  password: "' OR '1'='1",
};

export const veryLongEmailLogin = {
  email: 'a'.repeat(300) + '@test.com',
  password: 'password123',
};

// ── Edge-case registration payloads ──────────────────────────────────────────

export const invalidEmailRegistration = {
  email: 'notvalid',
  password: 'pass123',
  name: 'Bad Email User',
};

export const emptyStringFieldsRegistration = {
  email: '',
  password: '',
  name: '',
};

export const whitespaceNameRegistration = {
  email: `ws_${Date.now()}@test.com`,
  password: 'pass123',
  name: '   ',
};
