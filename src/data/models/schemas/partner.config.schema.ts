import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Merchant, Partner } from './partner.schema';

@Schema()
export class PartnerProductMapping extends Document {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  merchantId: string;

  @Prop({ required: true })
  merchantName: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  oldPrice: string;

  @Prop({ required: true })
  available: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  category: string;

  @Prop()
  type: string;

  @Prop()
  shippingCost: string;

  @Prop()
  language: string;

  @Prop()
  gtin: string;

  @Prop({ required: true })
  rawData: string;

  @Prop()
  updatedAt: string;
}

export const PartnerProductMappingSchema = SchemaFactory.createForClass(
  PartnerProductMapping,
);

@Schema()
export class MerchantConfiguration extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Merchant.name,
    required: true,
  })
  merchant: Types.ObjectId;

  @Prop()
  merchantAlias: string;

  @Prop({ required: true })
  s3FilePath: string;

  @Prop({ type: PartnerProductMapping, _id: false })
  productMapping: PartnerProductMapping;

  @Prop({ default: ';' })
  delimiter: string;
}

export const MerchantConfigurationSchema = SchemaFactory.createForClass(
  MerchantConfiguration,
);

@Schema()
export class PartnerConfiguration extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Partner.name,
    required: true,
  })
  partner: Types.ObjectId;

  @Prop({ required: true })
  partnerAlias: string;

  @Prop({ required: true })
  partnerId: string;

  @Prop({
    type: [Types.ObjectId],
    ref: MerchantConfiguration.name,
  })
  merchantConfigs: Types.ObjectId[];

  @Prop({ type: PartnerProductMapping, _id: false })
  defaultProductMapping: PartnerProductMapping;

  @Prop({ default: ';' })
  defaultDelimiter: string;
}

export const PartnerConfigurationSchema =
  SchemaFactory.createForClass(PartnerConfiguration);
