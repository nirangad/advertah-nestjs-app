import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksCommand } from './tasks.command';
import { PartnerConfigurationService } from 'src/partners/partner.config.service';
import { MongooseModule } from '@nestjs/mongoose';
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

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Partner.name, schema: PartnerSchema },
      { name: Merchant.name, schema: MerchantSchema },
      { name: PartnerConfiguration.name, schema: PartnerConfigurationSchema },
      { name: MerchantConfiguration.name, schema: MerchantConfigurationSchema },
      { name: PartnerProductMapping.name, schema: PartnerProductMappingSchema },
    ]),
  ],
  providers: [
    TasksService,
    TasksCommand,
    PartnerService,
    PartnerConfigurationService,
  ],
})
export class TasksModule {}
