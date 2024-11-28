export const AWS_S3_ADVERTAH_PRODUCT_FEEDS_PATH = 'product_feeds/partners';
export const PARAM_KEY = 'key';
export const PARAM_VALUE = 'value';

export const CONSTANTS = (() => {
  console.log('Environment: ', process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
    case 'production-ae':
      return {
        port: '3040',
        currency: 'AED',
        conversion_rates: {
          AED: 1,
          USD: 3.67,
          GBP: 4.66,
          EUR: 3.88,
        },
      };
    case 'production-us':
      return {
        port: '3050',
        currency: 'USD',
        conversion_rates: {
          AED: 0.27,
          USD: 1,
          GBP: 1.27,
          EUR: 1.06,
        },
      };
    case 'production-uk':
      return {
        port: '3060',
        currency: 'GBP',
        conversion_rates: {
          AED: 0.21,
          USD: 0.79,
          GBP: 1,
          EUR: 0.83,
        },
      };
    default:
      return {
        port: '3030',
        currency: 'AED',
        conversion_rates: {
          AED: 1,
          USD: 3.67,
          GBP: 4.66,
          EUR: 3.88,
        },
      };
  }
})();
