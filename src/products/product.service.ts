import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';

import {
  PER_PAGE,
  ProductSearchParams,
  ProductSortable,
  SortDirection,
} from './products.types';
import { Product, ProductSchema } from '../data/models/schemas/product.schema';
import {
  MerchantConfiguration,
  PartnerProductMapping,
} from 'src/data/models/schemas/partner.config.schema';
import { UtilityService } from 'src/utils/utility.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly utilityService: UtilityService,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  getProducts() {
    return this.productModel.find().exec();
  }

  async createProduct(product: Product) {
    const createdProduct = new this.productModel(product);
    return createdProduct.save();
  }

  async searchProducts(params: ProductSearchParams) {
    const {
      filter,
      sort,
      skip,
      totalProducts,
      currentPage,
      itemsPerPage,
      totalPages,
    } = await this.searchProductsQuery(params);

    const products = await this.productModel
      .find(filter, { rawData: 0 })
      .populate('merchant', 'merchant_id name partner _id ')
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage)
      .exec();

    return {
      totalProducts,
      currentPage,
      itemsPerPage,
      totalPages,
      products,
    };
  }

  async searchProductsQuery(params: ProductSearchParams) {
    let defaultParams: ProductSearchParams = this.defaultSearchParams();
    defaultParams = { ...defaultParams, ...params };
    const {
      query = '*',
      available = true,
      freeShipping = false,
      minPrice = undefined,
      maxPrice = undefined,
      merchant = undefined,
      currentPage = 1,
      itemsPerPage = PER_PAGE,
      sortBy = ProductSortable.UPDATED_AT,
      sortDirection = SortDirection.DESC,
    } = defaultParams;

    console.log('Search Products params:');
    console.log(defaultParams);

    const filter: any = {};

    // 1. Apply search query for productName, description, and gtin
    if (query && query != '*') {
      filter.$or = [
        { productName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { gtin: { $regex: query, $options: 'i' } },
      ];
    }

    // 2. Filter by availability, free shipping & merchant
    if (typeof available === 'boolean' && available) {
      filter.available = true;
    }

    if (typeof freeShipping === 'boolean' && freeShipping) {
      filter.shippingCost = 0;
    }

    if (merchant && Types.ObjectId.isValid(merchant)) {
      filter.merchant = new Types.ObjectId(merchant);
    }

    // 3. Filter by price range (minPrice and maxPrice)
    const minPriceNumber = parseFloat(`${minPrice}`);
    const maxPriceNumber = parseFloat(`${maxPrice}`);

    if (!isNaN(minPriceNumber) || !isNaN(maxPriceNumber)) {
      filter.$expr = { $and: [] };

      if (!isNaN(minPriceNumber)) {
        filter.$expr.$and.push({ $gte: ['$price', minPriceNumber] });
      }

      if (!isNaN(maxPriceNumber)) {
        filter.$expr.$and.push({ $lte: ['$price', maxPriceNumber] });
      }
    }

    // 4. Sort by updatedAt or any other field
    const sortDirectionValue: SortOrder =
      sortDirection === SortDirection.ASC ? 1 : -1;
    const sort = { [sortBy]: sortDirectionValue };

    // 5. Pagination
    const skip = (currentPage - 1) * itemsPerPage;

    // 6. Get the total count for pagination
    const totalProducts = await this.productModel.countDocuments(filter);

    return {
      filter,
      sort,
      skip,
      totalProducts,
      currentPage,
      itemsPerPage,
      totalPages: Math.ceil(totalProducts / itemsPerPage),
    };
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
    });

    product.merchant = merchantConfig.merchant;
    product.rawData = JSON.stringify(csvDataRow);

    const validationError = await product.validate();
    if (validationError == undefined) {
      return product.save();
    }
    console.error('[Construct Product]: Failed to save the new product');
  }

  private defaultSearchParams(): ProductSearchParams {
    return {
      available: true,
      currentPage: 1,
      discount: false,
      freeShipping: false,
      itemsPerPage: PER_PAGE,
      maxPrice: undefined,
      merchant: undefined,
      minPrice: undefined,
      query: '',
      sortBy: ProductSortable.UPDATED_AT,
      sortDirection: SortDirection.ASC,
    };
  }
}
