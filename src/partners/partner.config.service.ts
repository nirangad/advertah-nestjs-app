import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PartnerConfiguration } from 'src/data/models/schemas/partner.config.schema';
import { DeleteResult } from 'mongodb';

@Injectable()
export class PartnerConfigurationService {
  constructor(
    @InjectModel(PartnerConfiguration.name)
    private readonly partnerConfigModel: Model<PartnerConfiguration>,
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

  createConfiguration(configData: any): Promise<PartnerConfiguration> {
    const newConfig = new this.partnerConfigModel(configData);
    return newConfig.save();
  }

  async deleteConfiguration(partnerId: string): Promise<DeleteResult> {
    return this.partnerConfigModel.deleteOne({ partnerId: partnerId });
  }
}
