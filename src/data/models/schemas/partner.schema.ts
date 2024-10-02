import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

@Schema()
export class ProductFeedDefinition extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  definition: string;
}

@Schema()
export class ProductFeed extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  rawURL: string;

  @Prop({ type: [ProductFeedParam], required: true })
  params: ProductFeedParam[];

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ProductFeedFormat),
  })
  format: ProductFeedFormat;
}

@Schema()
export class PartnerAPIQuery extends Document {
  @Prop({ required: true })
  feed_id: string;

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

  @Prop({ required: true, default: false })
  only_sale: boolean;

  @Prop({ required: true })
  currency: string;
}

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

  @Prop({ type: PartnerAPIQuery, _id: false, required: true })
  query: PartnerAPIQuery;
}

@Schema()
export class Merchant extends Document {
  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  merchant_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: ProductFeed, _id: false, required: true })
  productFeed: ProductFeed;

  @Prop({
    type: [{ type: ProductFeedDefinition, _id: false }],
    required: true,
  })
  definitions: ProductFeedDefinition[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);

@Schema()
export class Partner extends Document {
  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  partner_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  credentials: Record<string, any>;

  @Prop({ type: [{ type: PartnerAPI, _id: false }] })
  api: PartnerAPI[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Merchant.name }],
    required: true,
  })
  merchants: Types.ObjectId[];
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
