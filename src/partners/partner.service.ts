import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { APIResponse } from '../app.types';
import { PartnerSearchParams } from './partner.types';
import { UtilityService } from 'src/utils/utility.service';
import {
  Merchant,
  Partner,
  ProductFeedFormat,
} from 'src/data/models/schemas/partner.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  AWS_S3_ADVERTAH_PRODUCT_FEEDS_PATH,
  PARAM_KEY,
  PARAM_VALUE,
} from 'src/constants';
import {
  PartnerConfiguration,
  PartnerProductMapping,
} from 'src/data/models/schemas/partner.config.schema';

@Injectable()
export class PartnerService {
  constructor(
    private readonly utilityService: UtilityService,
    private readonly configService: ConfigService,
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,
    @InjectModel(Merchant.name) private readonly merchantModel: Model<Merchant>,
    @InjectModel(PartnerConfiguration.name)
    private readonly partnerConfigModel: Model<PartnerConfiguration>,
    @InjectModel(PartnerProductMapping.name)
    private readonly partnerProductMapping: Model<PartnerProductMapping>,
  ) {}

  getPartner(partnerId: string): Promise<Partner> {
    return this.partnerModel
      .findOne({ partner_id: partnerId })
      .populate('merchants', 'name merchant_id')
      .exec();
  }

  async createPartner(partnerData: any): Promise<Partner> {
    const configData = partnerData.config;
    if (!configData) {
      return null;
    }
    delete partnerData['config'];

    const newPartner = new this.partnerModel(partnerData);
    await newPartner.save();

    configData['partnerId'] = partnerData.partner_id;
    configData['partner'] = newPartner._id;

    const newConfig = new this.partnerConfigModel(configData);
    newConfig.defaultProductMapping = new this.partnerProductMapping(
      configData.defaultProductMapping,
    );
    await newConfig.save();

    return newPartner;
  }

  updatePartner(partnerId: string, partnerData: any): Promise<Partner> {
    return this.partnerModel
      .findOneAndUpdate({ partner_id: partnerId }, partnerData, {
        new: true,
      })
      .populate('merchants', 'name merchant_id')
      .exec();
  }

  deletePartner(id: string): Promise<Partner> {
    return this.partnerModel.findByIdAndDelete(id);
  }

  getAllPartners(): Promise<Partner[]> {
    return this.partnerModel
      .find()
      .populate('merchants', 'name merchant_id')
      .exec();
  }

  async getMerchant(partnerId: string, merchantId: string): Promise<Merchant> {
    const partner = await this.getPartner(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    return this.merchantModel
      .findOne({ partner: partner._id, merchant_id: merchantId })
      .populate('partner')
      .exec();
  }

  async createMerchant(
    partnerId: string,
    merchantData: any,
  ): Promise<Merchant> {
    const partner = await this.getPartner(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    const newMerchant = new this.merchantModel({
      ...merchantData,
      partner: partner._id,
    });
    const createdMerchant = await newMerchant.save();

    partner.merchants.push(createdMerchant._id as Types.ObjectId);
    await partner.save();

    return newMerchant;
  }

  async updateMerchant(
    partnerId: string,
    merchantId: string,
    merchantData: any,
  ): Promise<Merchant> {
    const partner = await this.getPartner(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    return this.merchantModel
      .findByIdAndUpdate(merchantId, merchantData, {
        new: true,
      })
      .exec();
  }

  async getPartnerAndMerchant(partnerId: string, merchantId: string) {
    const partner = await this.getPartner(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    const merchant = await this.getMerchant(partnerId, merchantId);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return {
      partner,
      merchant,
    };
  }

  searchPartners(params: PartnerSearchParams): APIResponse {
    console.log(params);
    return {
      status: HttpStatus.OK,
      message: params,
    };
  }

  async getMerchantProductFeedURL(partnerId: string, merchantId: string) {
    const { partner, merchant } = await this.getPartnerAndMerchant(
      partnerId,
      merchantId,
    );

    if (!partner || !merchant) {
      throw new NotFoundException('Partner/Merchant not found');
    }

    return {
      feedURL: this.generateFeedURL(merchant.productFeed),
      s3FilePath: this.generateS3FileName(
        partner,
        merchant,
        merchant.productFeed.format,
      ),
    };
  }

  generateS3FileName(
    partner: Partner,
    merchant: Merchant,
    format: ProductFeedFormat,
  ) {
    return `${AWS_S3_ADVERTAH_PRODUCT_FEEDS_PATH}/${partner.partner_id}/${merchant.merchant_id}/${partner.partner_id}_${merchant.name}_${merchant.merchant_id}.${format}`.replace(
      ' ',
      '-',
    );
  }

  generateFeedURL(productFeed, raw = true) {
    if (raw) {
      return productFeed.rawURL;
    }

    const { data: pattern, delimiter } = productFeed.paramMap;
    return `${productFeed}${productFeed.params.map((p) => pattern.replace(PARAM_KEY, p.param).replace(PARAM_VALUE, p.default).join(delimiter))}`;
  }
}
