import type { ProductListParams } from '../src/types/api.types';

export const validProductId = 1;
export const nonExistentProductId = 99999;
export const invalidProductId = 'abc';

export const listProductsFilters: Record<string, ProductListParams> = {
  noFilters: {},
  byCategory: { category: 'electronics' },
  withPagination: { page: 1, limit: 5 },
  combinedFilters: { category: 'electronics', page: 1, limit: 3 },
  largePage: { page: 999, limit: 10 },
  nonExistentCategory: { category: 'quantum_hyperwidgets_xyz' },
};

export const negativeProductId = -1;
export const zeroProductId = 0;
export const floatProductId = '1.5';
