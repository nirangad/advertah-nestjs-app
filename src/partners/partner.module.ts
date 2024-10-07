import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Merchant,
  MerchantSchema,
  Partner,
  PartnerSchema,
} from 'src/data/models/schemas/partner.schema';
import { PartnerConfigurationController } from './partner.config.controller';
import { PartnerConfigurationService } from './partner.config.service';
import {
  MerchantConfiguration,
  MerchantConfigurationSchema,
  PartnerConfiguration,
  PartnerConfigurationSchema,
} from 'src/data/models/schemas/partner.config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Partner.name, schema: PartnerSchema },
      { name: Merchant.name, schema: MerchantSchema },
      { name: PartnerConfiguration.name, schema: PartnerConfigurationSchema },
      { name: MerchantConfiguration.name, schema: MerchantConfigurationSchema },
    ]),
  ],
  controllers: [PartnerConfigurationController, PartnerController],
  providers: [PartnerConfigurationService, PartnerService],
})
export class PartnerModule {}
