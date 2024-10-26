import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksCommand } from './tasks.command';
import { PartnerConfigurationService } from 'src/partners/partner.config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/data/models/schemas/product.schema';
import {
  PartnerConfiguration,
  PartnerConfigurationSchema,
  MerchantConfiguration,
  MerchantConfigurationSchema,
  PartnerProductMapping,
  PartnerProductMappingSchema,
} from 'src/data/models/schemas/partner.config.schema';
import {
  Partner,
  PartnerSchema,
  Merchant,
  MerchantSchema,
} from 'src/data/models/schemas/partner.schema';
import { PartnerService } from 'src/partners/partner.service';
import { ProductService } from 'src/products/product.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Partner.name, schema: PartnerSchema },
      { name: Merchant.name, schema: MerchantSchema },
      { name: PartnerConfiguration.name, schema: PartnerConfigurationSchema },
      { name: MerchantConfiguration.name, schema: MerchantConfigurationSchema },
      { name: PartnerProductMapping.name, schema: PartnerProductMappingSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksCommand,
    ProductService,
    PartnerService,
    PartnerConfigurationService,
  ],
})
export class TasksModule {}
