import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  MerchantConfiguration,
  PartnerProductMapping,
} from 'src/data/models/schemas/partner.config.schema';
import { PartnerConfigurationService } from 'src/partners/partner.config.service';
import { PartnerService } from 'src/partners/partner.service';
import { ProductService } from 'src/products/product.service';
import { UtilityService } from 'src/utils/utility.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly utilityService: UtilityService,
    private readonly productService: ProductService,
    private readonly partnerService: PartnerService,
    private readonly partnerConfigurationService: PartnerConfigurationService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async configForProductFeedS3File(partnerId: string, merchantId: string) {
    const partnerConfig =
      await this.partnerConfigurationService.getConfiguration(partnerId);

    if (!partnerConfig) {
      this.logger.error('Partner configurations are not available');
      throw new NotFoundException('Partner configurations are not available');
    }

    const merchantConfig =
      await this.partnerConfigurationService.getMerchantConfiguration(
        merchantId,
      );

    if (!merchantConfig) {
      this.logger.error('Merchant configurations are not available');
      throw new NotFoundException('Merchant configurations are not available');
    }

    const fileExists = await this.utilityService.checkS3FileExists(
      merchantConfig.s3FilePath,
    );

    if (!fileExists) {
      this.logger.error(
        'Product feed file does not exists for merchant: ',
        merchantConfig.s3FilePath,
      );
      throw new NotFoundException(
        'Product feed file does not exists for merchant',
      );
    }

    return {
      partnerConfig,
      merchantConfig,
      fileExists,
    };
  }

  async readProductFeedFile(
    merchantConfig: MerchantConfiguration,
    callbackRead: (data: any) => void,
    callbackComplete: (data: any) => void,
  ) {
    this.utilityService.loadCSVFromS3(
      merchantConfig.s3FilePath,
      merchantConfig.delimiter,
      callbackRead,
      callbackComplete,
    );
  }

  async downloadProductFeeds(partnerId: string, merchantId: string) {
    const { feedURL, s3FilePath } =
      await this.partnerService.getMerchantProductFeedURL(
        partnerId,
        merchantId,
      );
    const s3FilePathString =
      s3FilePath instanceof Promise ? await s3FilePath : s3FilePath;
    return await this.utilityService.streamFileToS3(feedURL, s3FilePathString);
  }

  async convertData(partnerId: string, merchantId: string) {
    if (!merchantId) {
      this.logger.error('Merchant ID is not provided');
      throw new NotFoundException('Merchant ID is not provided');
    }

    const { partnerConfig, merchantConfig } =
      await this.configForProductFeedS3File(partnerId, merchantId);

    const productMapping: PartnerProductMapping =
      merchantConfig.productMapping || partnerConfig.defaultProductMapping;

    if (!productMapping) {
      const errorMessage =
        'Failed to load Product Mapping for Partner/Merchant. Cannot create products without a Product Mapping';
      this.logger.error(errorMessage);
      throw new NotFoundException(errorMessage);
    }

    await this.readProductFeedFile(
      merchantConfig,
      async (row) => {
        const product = await this.productService.upsertProductForCSVRecord(
          row,
          productMapping,
          merchantConfig,
        );
        this.logger.debug('convertData: [Product]', product);
      },
      (rowCount) => {
        this.logger.debug(
          'Streaming CSV file from S3 successfully completed.',
          rowCount,
          'records read',
        );
      },
    );
  }
}
