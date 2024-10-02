import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { APIResponse } from '../app.types';
import { PartnerSearchParams } from './partner.types';
import { UtilityService } from 'src/utils/utility.service';
import {
  Merchant,
  Partner,
  PartnerAPI,
} from 'src/data/models/schemas/partner.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PartnerService {
  constructor(
    private readonly utilityService: UtilityService,
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
    @InjectModel(Merchant.name) private merchantModel: Model<Merchant>,
  ) {}

  getPartner(id: string): Promise<Partner> {
    return this.partnerModel.findById(id).populate('merchants').exec();
  }

  createPartner(partnerData: any): Promise<Partner> {
    const newPartner = new this.partnerModel(partnerData);
    return newPartner.save();
  }

  updatePartner(id: string, partnerData: any): Promise<Partner> {
    return this.partnerModel
      .findByIdAndUpdate(id, partnerData, {
        new: true,
      })
      .populate('merchants')
      .exec();
  }

  deletePartner(id: string): Promise<Partner> {
    return this.partnerModel.findByIdAndDelete(id);
  }

  getAllPartners(): Promise<Partner[]> {
    return this.partnerModel.find().exec();
  }

  getAllMerchants(id: string): Promise<Partner> {
    return this.partnerModel.findById(id).populate('merchants').exec();
  }

  getMerchant(id: string, merchantId: string): Promise<Merchant> {
    return this.merchantModel.findOne({ partner: id, _id: merchantId }).exec();
  }

  async createMerchant(id: string, merchantData: any): Promise<Merchant> {
    const partner = await this.getPartner(id);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    const newMerchant = new this.merchantModel({
      ...merchantData,
      partner: id,
    });
    await newMerchant.save();

    partner.merchants.push(newMerchant._id);
    await partner.save();

    return newMerchant;
  }

  async updateMerchant(
    id: string,
    merchantId: string,
    merchantData: any,
  ): Promise<Merchant> {
    const partner = await this.getPartner(id);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    return this.merchantModel
      .findByIdAndUpdate(merchantId, merchantData, {
        new: true,
      })
      .exec();
  }

  searchPartners(params: PartnerSearchParams): APIResponse {
    console.log(params);
    return {
      status: HttpStatus.OK,
      message: params,
    };
  }

  async getAPILinks(id: string) {
    const partner = await this.getPartner(id);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    return {
      status: HttpStatus.OK,
      message: partner.api.map((api) => this.generatePartnerAPILink(api)),
    };
  }

  generatePartnerAPILink(params: PartnerAPI): { usage: string; url: string } {
    const queryParams = this.utilityService.objectToKeyValueString(
      params.query,
    );
    return {
      usage: params.usage,
      url: `${params.scheme}://${params.host}${params.filename}?${queryParams.join('&')}`,
    };
  }
}
