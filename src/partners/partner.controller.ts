import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { APIResponse } from 'src/app.types';
import { PartnerService } from './partner.service';
import { Partner } from 'src/data/models/schemas/partner.schema';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  async getAllPartners(): Promise<APIResponse> {
    const partners = await this.partnerService.getAllPartners();
    return {
      status: HttpStatus.OK,
      message: partners,
    };
  }

  @Get(':id')
  async getPartner(@Param('id') id: string): Promise<APIResponse> {
    const partner = await this.partnerService.getPartner(id);
    let status = HttpStatus.OK;
    if (!partner) {
      status = HttpStatus.NOT_FOUND;
    }
    return {
      status,
      message: partner,
    };
  }

  @Post()
  async createPartner(@Body() partner: any): Promise<APIResponse> {
    let newPartner: Partner | string =
      await this.partnerService.createPartner(partner);
    let status = HttpStatus.OK;
    if (!newPartner) {
      status = HttpStatus.BAD_REQUEST;
      newPartner = 'Failed to create the partner';
    }
    return {
      status,
      message: newPartner,
    };
  }

  @Put(':id')
  async updatePartner(
    @Param('id') id: string,
    @Body() partner: any,
  ): Promise<APIResponse> {
    const newPartner = await this.partnerService.updatePartner(id, partner);
    let status = HttpStatus.OK;
    if (!newPartner) {
      status = HttpStatus.BAD_REQUEST;
    }
    return {
      status,
      message: newPartner,
    };
  }

  @Get(':id/merchants/')
  async getAllMerchants(@Param('id') id: string): Promise<APIResponse> {
    const partner = await this.partnerService.getPartner(id);
    return {
      status: !partner ? HttpStatus.NOT_FOUND : HttpStatus.OK,
      message: partner?.merchants || null,
    };
  }

  @Get(':id/merchants/:merchant_id')
  async getMerchant(
    @Param('id') id: string,
    @Param('merchant_id') merchantId: string,
  ): Promise<APIResponse> {
    const partner = await this.partnerService.getPartner(id);

    if (!partner) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: null,
      };
    }

    const merchants = await this.partnerService.getMerchant(id, merchantId);
    return {
      status: !merchants ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK,
      message: merchants,
    };
  }

  @Post(':id/merchants/')
  async createMerchant(
    @Param('id') id: string,
    @Body() merchant: any,
  ): Promise<APIResponse> {
    const partner = await this.partnerService.getPartner(id);

    if (!partner) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: null,
      };
    }

    const newMerchant = await this.partnerService.createMerchant(id, merchant);
    return {
      status: !newMerchant ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK,
      message: newMerchant,
    };
  }

  @Put(':id/merchants/:merchant_id')
  async updateMerchant(
    @Param('id') id: string,
    @Param('merchant_id') merchantId: string,
    @Body() merchant: any,
  ): Promise<APIResponse> {
    const updatedMerchant = await this.partnerService.updateMerchant(
      id,
      merchantId,
      merchant,
    );
    return {
      status: !updatedMerchant
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : HttpStatus.OK,
      message: updatedMerchant,
    };
  }
}
