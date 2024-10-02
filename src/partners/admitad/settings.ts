import {
  Merchant,
  Partner,
  PartnerAPI,
  PartnerAPIQuery,
  ProductFeed,
  ProductFeedDefinition,
  ProductFeedFormat,
  ProductFeedParam,
} from 'src/data/models/schemas/partner.schema';

export const params: Partial<ProductFeedParam>[] = [
  { param: 'user', type: 'string', default: 'advertah' },
  { param: 'code', type: 'string', default: 'es22q5z8ch' },
  {
    param: 'format',
    type: 'string',
    default: ProductFeedFormat.XML.toString(),
  },
  { param: 'currency', type: 'string', default: '' },
  { param: 'feed_id', type: 'string', default: '25189' },
  { param: 'last_import', type: 'string', default: '' },
];

/*
  Set Following:
  - params
*/
export const productFeed: Partial<ProductFeed> = {
  rawURL:
    'https://export.admitad.com/en/webmaster/websites/2700922/products/export_adv_products/?user=advertah&code=es22q5z8ch&format=xml&currency=&feed_id=25189&last_import=',
  url: 'https://export.admitad.com/en/webmaster/websites/2700922/products/export_adv_products/',
  format: ProductFeedFormat.XML,
};

export const definitions: Partial<ProductFeedDefinition>[] = [
  {
    type: 'root',
    definition: '',
  },
];

/*
  Set Following:
  - productFeed
  - definitions
*/
export const merchants: Partial<Merchant>[] = [
  {
    merchant_id: '25189',
    name: 'Boutiquefeel WW',
  },
];

export const query: Partial<PartnerAPIQuery> = {
  feed_id: '25186',
  website: '2700922',
  template: '',
  extension: ProductFeedFormat.XML,
  products_type: 'original',
  last_import: '2023.01.01.00.00',
  only_sale: true,
  currency: '',
};

/*
  Set Following:
  - query
*/
export const api: Partial<PartnerAPI>[] = [
  {
    usage: 'Get Export link',
    scheme: 'https',
    host: 'store.admitad.com',
    filename: '/en/webmaster/products/original/ajax/export_link/',
  },
];

/*
  Set Following:
  - productFeed
  - definitions
*/
export const awinMerchant: Partial<Merchant>[] = [
  {
    merchant_id: '58637',
    name: 'Boutiquefeel WW',
  },
];

/*
  Set Following:
  - api
  - merchants
*/
export const admitadPartner: Partial<Partner> = {
  partner_id: '25186',
  name: 'admitad',
  api: [],
  credentials: {},
  merchants: [],
};

//https://export.admitad.com/en/webmaster/websites/2700922/products/export_adv_products/?user=advertah&code=es22q5z8ch&format=xml&currency=&feed_id=25189&last_import=
