// export interface Partner {
//   partner_id: string;
//   name: string;
//   api: PartnerAPI[];
//   credentials: Record<string, any>;
//   merchants: Merchant[];
// }

// export interface Merchant {
//   merchant_id: string;
//   name: string;
//   productFeed: ProductFeed;
//   definitions: ProductFeedDefinition[];
// }

// export interface PartnerAPI {
//   usage: string;
//   scheme: string;
//   host: string;
//   filename: string;
//   query: {
//     feed_id: string;
//     website: string;
//     template: string;
//     extension: ProductFeedFormat;
//     products_type: string;
//     last_import: string;
//     only_sale: boolean;
//     currency: string;
//   };
// }

// export interface ProductFeed {
//   url: string;
//   rawURL: string;
//   params: ProductFeedParam[];
//   format: ProductFeedFormat;
// }

// export interface ProductFeedParam {
//   param: string;
//   type: string;
//   default: string;
// }

// export interface ProductFeedDefinition {
//   type: string;
//   definition: string;
// }

// export enum ProductFeedFormat {
//   JSON = 'json',
//   XML = 'xml',
//   CSV = 'csv',
// }

export interface PartnerSearchParams {
  query: string;
  active: boolean;
}
