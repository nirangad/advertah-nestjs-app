import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { APIResponse } from '../app.types';
import { ProductSearchParams } from './products.types';
import { Product } from '../data/models/schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  getProducts(): APIResponse {
    return {
      status: HttpStatus.OK,
      message: ['Product 01', 'Product 02', 'Product 03'],
    };
  }

  async createProduct(product: Product): Promise<APIResponse> {
    const createdProduct = new this.productModel(product);
    return {
      status: HttpStatus.OK,
      message: createdProduct.save(),
    };
  }

  searchProducts(params: ProductSearchParams): APIResponse {
    console.log(params);
    return {
      status: HttpStatus.OK,
      message: 'Product Created',
    };
  }
}
