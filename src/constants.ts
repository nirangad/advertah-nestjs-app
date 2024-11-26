import { environment } from './environments/environment';

export const AWS_S3_ADVERTAH_PRODUCT_FEEDS_PATH = 'product_feeds/partners';
export const PARAM_KEY = 'key';
export const PARAM_VALUE = 'value';

export const CONSTANTS = (() => {
  console.log('Environment: ', environment.envName);
  switch (environment.envName) {
    case 'production-ae':
      return {
        port: '3040',
      };
    case 'production-us':
      return {
        port: '3050',
      };
    case 'production-uk':
      return {
        port: '3060',
      };
    default:
      return {
        port: '3030',
      };
  }
})();
