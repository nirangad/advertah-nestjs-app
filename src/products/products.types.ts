export interface ProductSearchParams {
  query?: string;
  available?: boolean;
  currentPage?: number;
  discount: boolean;
  itemsPerPage?: number;
  sortBy?: ProductSortable;
  sortDirection?: SortDirection;
  minPrice?: number;
  maxPrice?: number;
  merchant?: string;
  freeShipping?: boolean;
}

export enum ProductSortable {
  PRODUCT_NAME = 'productName',
  PRICE = 'price',
  SHIPPING_COST = 'shippingCost',
  UPDATED_AT = 'updatedAt',
  CREATED_AT = 'createdAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export const PER_PAGE = 20;
