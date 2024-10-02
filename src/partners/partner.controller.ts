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

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // getAPILinks(partner: Partner) {
  //   return this.partnerService.getAPILinks(partner);
  // }

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
    const newPartner = await this.partnerService.createPartner(partner);
    let status = HttpStatus.OK;
    if (!newPartner) {
      status = HttpStatus.BAD_REQUEST;
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
}
