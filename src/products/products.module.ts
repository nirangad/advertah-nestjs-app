import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from '../data/models/schemas/product.schema';
import { Partner, PartnerSchema } from 'src/data/models/schemas/partner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Partner.name, schema: PartnerSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule {}
