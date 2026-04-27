import 'dotenv/config';

interface Credentials {
  admin: { email: string; password: string };
  testUser: { email: string; password: string; name: string };
}

interface Endpoints {
  auth: { login: string; register: string };
  products: { list: string; byId: (id: number | string) => string };
  cart: {
    items: string;
    view: string;
    removeItem: (itemId: number | string) => string;
  };
  orders: {
    place: string;
    byId: (orderId: string) => string;
    cancel: (orderId: string) => string;
  };
  payments: {
    initiate: string;
    byId: (paymentId: string) => string;
  };
}

interface Config {
  baseURL: string;
  timeout: number;
  credentials: Credentials;
  endpoints: Endpoints;
}

const config: Config = {
  baseURL: process.env['BASE_URL'] ?? 'http://localhost:3000',
  timeout: parseInt(process.env['TEST_TIMEOUT'] ?? '30000', 10),
  credentials: {
    admin: {
      email: process.env['ADMIN_EMAIL'] ?? 'admin@shopeasy.com',
      password: process.env['ADMIN_PASSWORD'] ?? 'password123',
    },
    testUser: {
      email: process.env['TEST_USER_EMAIL'] ?? 'testuser@shopeasy.com',
      password: process.env['TEST_USER_PASSWORD'] ?? 'testpass123',
      name: process.env['TEST_USER_NAME'] ?? 'Test User',
    },
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
    },
    products: {
      list: '/products',
      byId: (id) => `/products/${id}`,
    },
    cart: {
      items: '/cart/items',
      view: '/cart',
      removeItem: (itemId) => `/cart/items/${itemId}`,
    },
    orders: {
      place: '/orders',
      byId: (orderId) => `/orders/${orderId}`,
      cancel: (orderId) => `/orders/${orderId}/cancel`,
    },
    payments: {
      initiate: '/payments',
      byId: (paymentId) => `/payments/${paymentId}`,
    },
  },
};

export default config;
