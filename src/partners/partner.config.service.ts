import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  MerchantConfiguration,
  PartnerConfiguration,
  PartnerProductMapping,
} from 'src/data/models/schemas/partner.config.schema';
import { DeleteResult } from 'mongodb';
import { PartnerService } from './partner.service';

@Injectable()
export class PartnerConfigurationService {
  constructor(
    private readonly partnerService: PartnerService,
    @InjectModel(PartnerProductMapping.name)
    private readonly partnerProductMapping: Model<PartnerProductMapping>,
    @InjectModel(PartnerConfiguration.name)
    private readonly partnerConfigModel: Model<PartnerConfiguration>,
    @InjectModel(MerchantConfiguration.name)
    private readonly merchantConfigModel: Model<MerchantConfiguration>,
  ) {}

  getAllConfigurations(): Promise<PartnerConfiguration[]> {
    return this.partnerConfigModel.find().exec();
  }

  async getConfiguration(partnerId: string): Promise<PartnerConfiguration> {
    return this.partnerConfigModel.findOne({ partnerId: partnerId }).exec();
  }

  async createConfiguration(configData: any): Promise<PartnerConfiguration> {
    const partner = await this.partnerService.getPartner(configData.partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    configData.partner = partner._id;
    configData.partnerId = partner.partner_id;

    const newConfig = new this.partnerConfigModel(configData);
    newConfig.defaultProductMapping = new this.partnerProductMapping(
      configData.defaultProductMapping,
    );
    return newConfig.save();
  }

  async getMerchantConfiguration(
    merchantId: string,
  ): Promise<MerchantConfiguration> {
    return this.merchantConfigModel
      .findOne({ merchantId: merchantId })
      .populate('merchant')
      .exec();
  }

  async createMerchantConfiguration(
    partnerId: string,
    merchantId: string,
    merchantConfigData: any,
  ): Promise<MerchantConfiguration> {
    console.log('[PARTNER] :', partnerId);
    const partner = await this.partnerService.getPartner(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    const merchant = await this.partnerService.getMerchant(
      partnerId,
      merchantId,
    );
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    const config = await this.getConfiguration(partnerId);
    if (!config) {
      throw new NotFoundException('Please create Partner Configuration first');
    }

    merchantConfigData.merchant = merchant._id;
    merchantConfigData.merchantId = merchant.merchant_id;

    const newMerchantConfig = new this.merchantConfigModel(merchantConfigData);
    const createdMerchantConfig: MerchantConfiguration =
      await newMerchantConfig.save();

    if (!createdMerchantConfig) {
      throw new NotFoundException('Failed to create Merchant Configuration');
    }
    await config.save();

    return createdMerchantConfig.save();
  }

  async deleteConfiguration(partnerId: string): Promise<DeleteResult> {
    return this.partnerConfigModel.deleteOne({ partnerId: partnerId });
  }

  async updateMerchantS3FilePath(
    s3FilePath: string,
    partnerId: string,
    merchantId: string,
  ) {
    const merchantConfig = await this.getMerchantConfiguration(merchantId);
    if (!merchantConfig) {
      console.warn(
        'Merchant Configurations not found. Creating new configurations..',
      );
      return this.createMerchantConfiguration(partnerId, merchantId, {
        merchantId: merchantId,
        s3FilePath: s3FilePath,
      });
    } else {
      merchantConfig.s3FilePath = s3FilePath;
      return merchantConfig.save();
    }
  }
}
