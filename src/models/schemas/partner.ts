import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProductFeedFormat {
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
}

@Schema()
export class ProductFeedParam extends Document {
  @Prop({ required: true })
  param: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  default: string;
}

export const ProductFeedParamSchema =
  SchemaFactory.createForClass(ProductFeedParam);

@Schema()
export class ProductFeedDefinition extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  definition: string;
}

export const ProductFeedDefinitionSchema = SchemaFactory.createForClass(
  ProductFeedDefinition,
);

@Schema()
export class ProductFeed extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ type: [ProductFeedParam], required: true })
  params: ProductFeedParam[];

  @Prop({
    type: ProductFeedFormat,
    required: true,
    enum: Object.values(ProductFeedFormat),
  })
  format: ProductFeedFormat;
}

export const ProductFeedSchema = SchemaFactory.createForClass(ProductFeed);

@Schema()
export class PartnerAPIQuery extends Document {
  @Prop({ required: true })
  feed: string;

  @Prop({ required: true })
  website: string;

  @Prop({ required: true })
  template: string;

  @Prop({ enum: ProductFeedFormat, required: true })
  extension: ProductFeedFormat;

  @Prop({ required: true })
  products_type: string;

  @Prop({ required: true })
  last_import: string;

  @Prop({ default: false })
  only_sale: boolean;

  @Prop({ required: true })
  currency: string;
}

export const PartnerAPIQuerySchema =
  SchemaFactory.createForClass(PartnerAPIQuery);

@Schema()
export class PartnerAPI extends Document {
  @Prop({ required: true })
  usage: string;

  @Prop({ required: true })
  scheme: string;

  @Prop({ required: true })
  host: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ type: PartnerAPIQuerySchema, required: true }) // Embedding Query schema
  query: PartnerAPIQuery;
}

export const PartnerAPISchema = SchemaFactory.createForClass(PartnerAPI);

@Schema()
export class Merchant extends Document {
  @Prop({ required: true })
  merchant_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: ProductFeed, required: true })
  productFeed: ProductFeed;

  @Prop({ type: [ProductFeedDefinition], required: true })
  definitions: ProductFeedDefinition[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);

@Schema()
export class Partner extends Document {
  @Prop({ required: true })
  partner_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  credentials: Record<string, any>;

  @Prop({ type: [PartnerAPI], required: true })
  api: PartnerAPI[];

  @Prop({ type: [Merchant], required: true })
  merchants: Merchant[];
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
