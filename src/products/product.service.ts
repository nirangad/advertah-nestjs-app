import { HttpStatus, Injectable } from '@nestjs/common';
import { APIResponse } from '../app.types';
import { ProductSearchParams } from './products.types';

@Injectable()
export class ProductService {
  getProducts(): APIResponse {
    return {
      status: HttpStatus.OK,
      message: ['Product 01', 'Product 02', 'Product 03'],
    };
  }

  searchProducts(params: ProductSearchParams): APIResponse {
    console.log(params);
    return {
      status: HttpStatus.OK,
      message: params,
    };
  }
}
