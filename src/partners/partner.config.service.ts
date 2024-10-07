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
    @InjectModel(PartnerProductMapping.name)
    private readonly partnerProductMapping: Model<PartnerProductMapping>,
    @InjectModel(PartnerConfiguration.name)
    private readonly partnerConfigModel: Model<PartnerConfiguration>,
    @InjectModel(MerchantConfiguration.name)
    private readonly merchantConfigModel: Model<MerchantConfiguration>,
    private readonly partnerService: PartnerService,
  ) {}

  getAllConfigurations(): Promise<PartnerConfiguration[]> {
    return this.partnerConfigModel.find().populate('merchantConfigs').exec();
  }

  async getConfiguration(partnerId: string): Promise<PartnerConfiguration> {
    return this.partnerConfigModel
      .findOne({ partnerId: partnerId })
      .populate('merchantConfigs')
      .exec();
  }

  async createConfiguration(configData: any): Promise<PartnerConfiguration> {
    const partner = await this.partnerService.getPartner(configData.partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    configData.partner = partner._id;
    configData.partnerAlias = partner.name;
    configData.partnerId = partner.partner_id;
    console.log('Config Data: ', configData);

    const newConfig = new this.partnerConfigModel(configData);
    newConfig.defaultProductMapping = new this.partnerProductMapping(
      configData.defaultProductMapping,
    );
    return newConfig.save();
  }

  async createMerchantConfiguration(
    partnerId: string,
    merchantId: string,
    merchantConfigData: any,
  ): Promise<MerchantConfiguration> {
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

    console.log('Partner >> Merchants: ', partner.merchants);
    console.log('Payload: ', merchantConfigData);

    const config = await this.getConfiguration(partnerId);
    if (!config) {
      throw new NotFoundException('Configuration not found');
    }

    console.log('Config: ', config);

    console.log('Partner >> Merchants: ', partner.merchants);
    console.log('Payload: ', merchantConfigData);

    merchantConfigData.merchant = merchant._id;
    merchantConfigData.merchantAlias = merchant.name;

    const newMerchantConfig = new this.merchantConfigModel(merchantConfigData);
    const createdMerchantConfig: MerchantConfiguration =
      await newMerchantConfig.save();

    if (!createdMerchantConfig) {
      throw new NotFoundException('Failed to create Merchant Configuration');
    }

    config.merchantConfigs.push(createdMerchantConfig._id as Types.ObjectId);
    await config.save();

    return createdMerchantConfig.save();
  }

  async deleteConfiguration(partnerId: string): Promise<DeleteResult> {
    return this.partnerConfigModel.deleteOne({ partnerId: partnerId });
  }
}
