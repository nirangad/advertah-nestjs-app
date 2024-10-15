import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { APIResponse } from 'src/app.types';
import { ProductSearchParams } from './products.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  // query:*
  // available:false
  // freeShipping:false
  // minPrice:undefined
  // maxPrice:undefined
  // currentPage:1
  // itemsPerPage:20
  // sortBy:updatedAt,
  // sortDirection:asc
  @Get('/')
  async searchProducts(
    @Query() params: ProductSearchParams,
  ): Promise<APIResponse> {
    const response = await this.productService.searchProducts(params);

    return {
      status: HttpStatus.OK,
      message: response,
    };
  }
}
