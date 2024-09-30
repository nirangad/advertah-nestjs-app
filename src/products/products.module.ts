import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductService } from './product.service';
import {
  Product,
  ProductSchema,
  ProductImage,
  ProductImageSchema,
} from '../data/models/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      {
        name: ProductImage.name,
        schema: ProductImageSchema,
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule {}
