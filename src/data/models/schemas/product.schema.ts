import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Merchant } from './partner.schema';

@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop()
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: Merchant.name,
    required: true,
  })
  merchant: Types.ObjectId;

  @Prop()
  currency: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  oldPrice: number;

  @Prop()
  available: boolean;

  @Prop()
  image: string;

  @Prop({ unique: true, sparse: true })
  url: string;

  @Prop()
  category: string;

  @Prop()
  type: string;

  @Prop({ default: 0 })
  shippingCost: number;

  @Prop()
  language: string;

  @Prop()
  gtin: string;

  @Prop()
  rawData: string;

  @Prop()
  lastUpdatedAt: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
