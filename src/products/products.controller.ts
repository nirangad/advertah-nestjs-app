import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { APIResponse } from 'src/app.types';
import { ProductSearchParams } from './products.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): APIResponse {
    return this.productService.getProducts();
  }

  @Get('/search')
  searchProducts(
    @Query('query') query: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('merchant') merchant: string,
    @Query('discount') discount: boolean,
    @Query('freeShipping') freeShipping: boolean,
  ): APIResponse {
    // http://localhost:3030/products/search?query=nirannga&minPrice=100&maxPrice=2s00&merchant=advertah&discount=1&freeShipping=0
    const params: ProductSearchParams = {
      query,
      minPrice,
      maxPrice,
      merchant,
      discount,
      freeShipping,
    };
    return this.productService.searchProducts(params);
  }
}
