import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';

import {
  PER_PAGE,
  ProductSearchParams,
  ProductSortable,
  SortDirection,
} from './products.types';
import { Product, ProductSchema } from '../data/models/schemas/product.schema';
import { PartnerProductMapping } from 'src/data/models/schemas/partner.config.schema';
import { UtilityService } from 'src/utils/utility.service';
import { Merchant } from 'src/data/models/schemas/partner.schema';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly utilityService: UtilityService,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  getProducts() {
    return this.productModel.find().exec();
  }

  getProduct(productId: string) {
    return this.productModel.findOne({ productId: productId }).exec();
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
      sortBy = ProductSortable.PRODUCT_NAME,
      sortDirection = SortDirection.ASC,
    } = defaultParams;

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

    // Disabling Merchant filter for future use
    // if (merchant && Types.ObjectId.isValid(merchant)) {
    //   filter.merchant = new Types.ObjectId(merchant);
    // }

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

  async upsertProductForCSVRecord(
    csvDataRow: any,
    productMapping: PartnerProductMapping,
    merchant: Merchant,
  ) {
    // Product Mapping Validation
    if (!productMapping) {
      this.logger.error('Product Mapping not provided');
      return;
    }

    // Product ID Validation
    const productId = csvDataRow[productMapping.productId];
    if (!productId) {
      this.logger.error(
        'Mandatory Field Missing: Product ID does not exist the provided CSV row',
      );
      return;
    }

    const existingProduct = await this.getProduct(productId);
    if (existingProduct) {
      this.logger.log(
        'Updating Existing Product: ',
        existingProduct.productName,
      );
      return await this.updateProductForCSVRecord(
        csvDataRow,
        productMapping,
        productId,
      );
    } else {
      this.logger.log('Creating New Product: ');
      return await this.createProductForCSVRecord(
        csvDataRow,
        productMapping,
        merchant,
      );
    }
  }

  private async updateProductForCSVRecord(
    csvDataRow: any,
    productMapping: PartnerProductMapping,
    productId: string,
  ) {
    // Preparing product data
    const updateData: any = {};
    ProductSchema.eachPath((field, fieldType) => {
      if (field.startsWith('_') || field == 'merchant') {
        return;
      }
      const csvField = productMapping[field];
      const castedField = this.utilityService.typeCast(
        csvDataRow[csvField],
        fieldType.instance,
      );

      updateData[field] = castedField;
    });

    // Updating the product
    try {
      const product = await this.productModel.updateOne(
        { productId: productId },
        updateData,
        {
          runValidators: true,
        },
      );
      return product;
    } catch (e) {
      this.logger.error(
        '[Update Product from CSV]: Failed to save the new product',
        e,
      );
    }
  }

  private async createProductForCSVRecord(
    csvDataRow,
    productMapping,
    merchant,
  ): Promise<Product> {
    const product = new this.productModel();
    ProductSchema.eachPath((field, fieldType) => {
      if (field.startsWith('_')) {
        return;
      }
      const csvField = productMapping[field];
      const castedField = this.utilityService.typeCast(
        csvDataRow[csvField],
        fieldType.instance,
      );

      product[field] = castedField;
    });

    product.merchant = merchant;
    product.rawData = JSON.stringify(csvDataRow);

    try {
      const validationError = await product.validate();
      if (validationError == undefined) {
        return product.save();
      }
      this.logger.error(
        '[Create Product from CSV]: Failed to save the new product',
      );
    } catch (e) {
      this.logger.error(
        '[Create Product from CSV]: Failed to save the new product',
        e,
      );
    }
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
