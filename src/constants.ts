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
          GBP: 4.87,
          EUR: 4.18,
          SGD: 2.8,
        },
      };
    case 'production-us':
      return {
        port: '3050',
        currency: 'USD',
        conversion_rates: {
          AED: 0.27,
          USD: 1,
          GBP: 1.33,
          EUR: 1.14,
          SGD: 0.76,
        },
      };
    case 'production-uk':
      return {
        port: '3060',
        currency: 'GBP',
        conversion_rates: {
          AED: 0.21,
          USD: 0.75,
          GBP: 1,
          EUR: 0.86,
          SGD: 0.58,
        },
      };
    case 'production-sg':
      return {
        port: '3070',
        currency: 'SGD',
        conversion_rates: {
          AED: 0.36,
          USD: 1.31,
          GBP: 1.74,
          EUR: 1.49,
          SGD: 1,
        },
      };
    default:
      return {
        port: '3000',
        currency: 'AED',
        conversion_rates: {
          AED: 1,
          USD: 3.67,
          GBP: 4.87,
          EUR: 4.18,
          SGD: 2.8,
        },
      };
  }
})();
