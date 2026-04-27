import type { APIRequestContext } from '@playwright/test';

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  message?: string;
}

export interface RegisterResponse {
  userId: number;
  message: string;
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ProductListResponse {
  total: number;
  page: number;
  limit: number;
  data: Product[];
}

export interface ProductListParams {
  category?: string;
  page?: number;
  limit?: number;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  message: string;
  cartTotal: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
  [key: string]: unknown;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface RemoveCartItemResponse {
  message: string;
  cartTotal: number;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  orderId: string;
  status: OrderStatus;
  total: number;
  items: CartItem[];
  createdAt: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  total: number;
  status: OrderStatus;
  message: string;
}

export interface CancelOrderResponse {
  orderId: string;
  status: OrderStatus;
  message: string;
}

// ── Payments ──────────────────────────────────────────────────────────────────

export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'net_banking';

export interface PaymentRequest {
  orderId: string;
  method: PaymentMethod;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  status: string;
  amount: number;
  message: string;
}

export interface PaymentDetails {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: string;
  processedAt: string;
}

// ── Error ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}

// ── Auth helper return types ───────────────────────────────────────────────────

export interface AuthClientResult {
  client: APIRequestContext;
  token: string;
  userId: number;
}

export interface LoginResult {
  token: string;
  userId: number;
}
