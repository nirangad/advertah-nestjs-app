import { Partner, ProductFeedFormat } from '../partner.types';

const admitadPartner: Partner = {
  id: '9578xc',
  name: 'admitad',
  api: [
    {
      usage: 'Get Export link',
      scheme: 'https',
      host: 'store.admitad.com',
      filename: '/en/webmaster/products/original/ajax/export_link/',
      query: {
        feed: '25186',
        website: '2700922',
        template: '',
        extension: ProductFeedFormat.XML,
        products_type: 'original',
        last_import: '2023.01.01.00.00',
        only_sale: true,
        currency: '',
      },
    },
  ],
  credentials: {},
  merchants: [
    {
      id: 'gafc73',
      merchant: 'Boutiquefeel WW',
      productFeed: {
        url: 'https://export.admitad.com/en/webmaster/websites/2700922/products/export_adv_products/',
        params: [
          { param: 'user', type: 'string', default: 'advertah' },
          { param: 'code', type: 'string', default: 'es22q5z8ch' },
          { param: 'format', type: 'string', default: 'xml' },
          { param: 'currency', type: 'string', default: '' },
          { param: 'feed_id', type: 'string', default: '25189' },
          { param: 'last_import', type: 'string', default: '' },
        ],
        format: ProductFeedFormat.XML,
      },
      definitions: [
        {
          type: 'root',
          definition: '',
        },
      ],
    },
  ],
};

export default admitadPartner;

//https://export.admitad.com/en/webmaster/websites/2700922/products/export_adv_products/?user=advertah&code=es22q5z8ch&format=xml&currency=&feed_id=25189&last_import=
