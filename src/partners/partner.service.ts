import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { APIResponse } from '../app.types';
import { PartnerSearchParams } from './partner.types';
import { UtilityService } from 'src/utils/utility.service';
import { Partner, PartnerAPI } from 'src/data/models/schemas/partner.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PartnerService {
  constructor(
    private readonly utilityService: UtilityService,
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
  ) {}

  getPartner(id: string): Promise<Partner> {
    return this.partnerModel.findById(id).populate('merchants').exec();
  }

  createPartner(partnerData: any): Promise<Partner> {
    const createdItem = new this.partnerModel(partnerData);
    return createdItem.save();
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
    return this.partnerModel.find().populate('merchants').exec();
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
      throw new NotFoundException('Item not found');
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
