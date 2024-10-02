import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { APIResponse } from '../app.types';
import { PartnerSearchParams } from './partner.types';
import { UtilityService } from 'src/utils/utility.service';
import {
  Merchant,
  Partner,
  PartnerAPI,
} from 'src/data/models/schemas/partner.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PartnerService {
  constructor(
    private readonly utilityService: UtilityService,
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,
    @InjectModel(Merchant.name) private readonly merchantModel: Model<Merchant>,
  ) {}

  getPartner(id: string): Promise<Partner> {
    return this.partnerModel
      .findOne({ partner_id: id })
      .populate('merchants', 'name merchant_id')
      .exec();
  }

  createPartner(partnerData: any): Promise<Partner> {
    const newPartner = new this.partnerModel(partnerData);
    return newPartner.save();
  }

  updatePartner(id: string, partnerData: any): Promise<Partner> {
    return this.partnerModel
      .findOneAndUpdate({ partner_id: id }, partnerData, {
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

  async getMerchant(id: string, merchantId: string): Promise<Merchant> {
    const partner = await this.getPartner(id);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    return this.merchantModel
      .findOne({ partner: partner._id, merchant_id: merchantId })
      .populate('partner')
      .exec();
  }

  async createMerchant(id: string, merchantData: any): Promise<Merchant> {
    const partner = await this.getPartner(id);
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
