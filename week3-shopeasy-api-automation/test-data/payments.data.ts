import type { PaymentMethod, PaymentRequest } from '../src/types/api.types';

export const validPaymentMethods: PaymentMethod[] = [
  'credit_card',
  'debit_card',
  'upi',
  'net_banking',
];

export const validPaymentRequest = (orderId: string): PaymentRequest => ({
  orderId,
  method: 'credit_card',
});

export const upiPaymentRequest = (orderId: string): PaymentRequest => ({
  orderId,
  method: 'upi',
});

export const missingOrderIdPayment: Partial<PaymentRequest> = {
  method: 'credit_card',
};

export const missingMethodPayment: Partial<PaymentRequest> = {
  orderId: 'ORD-1001',
};

export const invalidMethodPayment = {
  orderId: 'ORD-1001',
  method: 'cash_on_delivery',
};

export const validPaymentId = 'PAY-5001';
export const nonExistentPaymentId = 'PAY-99999';
