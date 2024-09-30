import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProductImage extends Document {
  @Prop({ required: true })
  url: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: ProductImageSchema, required: true })
  productImage: ProductImage;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  language: string;

  @Prop({ default: false })
  discount: boolean;

  @Prop({ default: false })
  freeShipping: boolean;

  @Prop({ required: true })
  partner: string;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  rawProduct: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
