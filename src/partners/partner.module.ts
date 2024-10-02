import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from 'src/data/models/schemas/partner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }]),
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
