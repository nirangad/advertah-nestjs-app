import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { APIResponse } from '../app.types';
import { ProductSearchParams } from './products.types';
import { Product, ProductSchema } from '../data/models/schemas/product.schema';
import {
  MerchantConfiguration,
  PartnerProductMapping,
} from 'src/data/models/schemas/partner.config.schema';
import { UtilityService } from 'src/utils/utility.service';
import { Partner } from 'src/data/models/schemas/partner.schema';

@Injectable()
export class ProductService {
  constructor(
    private readonly utilityService: UtilityService,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,
  ) {}

  getProducts(): APIResponse {
    return {
      status: HttpStatus.OK,
      message: ['Product 01', 'Product 02', 'Product 03'],
    };
  }

  async createProduct(product: Product) {
    const createdProduct = new this.productModel(product);
    return createdProduct.save();
  }

  searchProducts(params: ProductSearchParams) {
    console.log(params);
    return params;
  }

  async createProductForCSVRecord(
    csvDataRow: any,
    productMapping: PartnerProductMapping,
    merchantConfig: MerchantConfiguration,
  ) {
    if (!productMapping) {
      throw new NotFoundException('Product Mapping not provided');
    }

    const product: Product = await this.constructProduct(
      csvDataRow,
      productMapping,
      merchantConfig,
    );
    return product;
  }

  async constructProduct(
    csvDataRow,
    productMapping,
    merchantConfig,
  ): Promise<Product> {
    const product = new this.productModel();
    const productData: any = {};
    ProductSchema.eachPath((field, fieldType) => {
      if (field.startsWith('_') || field === '__v') {
        return;
      }
      const csvField = productMapping[field];
      const castedField = this.utilityService.typeCast(
        csvDataRow[csvField],
        fieldType.instance,
      );
      product[field] = castedField;
      productData[field] = castedField;
    });

    product.merchant = merchantConfig.merchant;
    product.rawData = JSON.stringify(csvDataRow);

    const validationError = await product.validate();
    if (validationError == undefined) {
      return product.save();
    }
    console.error('[Construct Product]: Failed to save the new product');
  }
}
