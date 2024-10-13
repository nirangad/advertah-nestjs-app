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

  @Prop()
  price: string;

  @Prop()
  oldPrice: string;

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

  @Prop()
  shippingCost: string;

  @Prop()
  language: string;

  @Prop()
  gtin: string;

  @Prop()
  rawData: string;

  @Prop()
  updatedAt: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
