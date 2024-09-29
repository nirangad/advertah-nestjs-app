export interface ProductSearchParams {
  query: string;
  minPrice: number;
  maxPrice: number;
  merchant: string;
  discount: boolean;
  freeShipping: boolean;
}
