import type { CartItemRequest } from '../src/types/api.types';

export const validCartItem: CartItemRequest = {
  productId: 1,
  quantity: 2,
};

export const anotherValidCartItem: CartItemRequest = {
  productId: 2,
  quantity: 1,
};

export const cartItemMinQuantity: CartItemRequest = {
  productId: 1,
  quantity: 1,
};

export const cartItemZeroQuantity: Partial<CartItemRequest> = {
  productId: 1,
  quantity: 0,
};

export const cartItemMissingProductId: Partial<CartItemRequest> = {
  quantity: 2,
};

export const cartItemMissingQuantity: Partial<CartItemRequest> = {
  productId: 1,
};

export const cartItemNonExistentProduct: CartItemRequest = {
  productId: 99999,
  quantity: 1,
};

export const itemIdToRemove = 1;
export const nonExistentItemId = 99999;
export const stringItemId = 'abc';

export const cartItemNegativeQuantity: Partial<CartItemRequest> = {
  productId: 1,
  quantity: -1,
};

export const cartItemLargeQuantity: CartItemRequest = {
  productId: 1,
  quantity: 9999,
};
