import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://petstore.swagger.io/v2/',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
