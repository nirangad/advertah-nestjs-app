export interface Partner {
  id: string;
  name: string;
  api: PartnerAPI[];
  credentials: Record<string, any>;
  merchants: Merchant[];
}

export interface Merchant {
  id: string;
  merchant: string;
  productFeed: ProductFeed;
  definitions: ProductFeedDefinition[];
}

export interface PartnerAPI {
  usage: string;
  scheme: string;
  host: string;
  filename: string;
  query: {
    feed: string;
    website: string;
    template: string;
    extension: ProductFeedFormat;
    products_type: string;
    last_import: string;
    only_sale: boolean;
    currency: string;
  };
}

export interface ProductFeed {
  url: string;
  params: ProductFeedParam[];
  format: ProductFeedFormat;
}

export interface ProductFeedParam {
  param: string;
  type: string;
  default: string;
}

export interface ProductFeedDefinition {
  type: string;
  definition: string;
}

export enum ProductFeedFormat {
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
}

export interface PartnerSearchParams {
  query: string;
  format: ProductFeedFormat;
  active: boolean;
}
