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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Partner.name, schema: PartnerSchema },
      { name: Merchant.name, schema: MerchantSchema },
    ]),
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
