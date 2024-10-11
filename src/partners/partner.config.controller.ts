import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { APIResponse } from 'src/app.types';
import { PartnerConfigurationService } from './partner.config.service';

@Controller('config/partners')
export class PartnerConfigurationController {
  constructor(
    private readonly partnerConfigService: PartnerConfigurationService,
  ) {}

  @Get()
  async getAllConfigurations(): Promise<APIResponse> {
    const configs = await this.partnerConfigService.getAllConfigurations();
    return {
      status: HttpStatus.OK,
      message: configs,
    };
  }

  @Get(':id')
  async getConfiguration(@Param('id') partnerId: string): Promise<APIResponse> {
    const config = await this.partnerConfigService.getConfiguration(partnerId);
    return {
      status: HttpStatus.OK,
      message: config,
    };
  }

  @Post()
  async createConfiguration(@Body() config: any): Promise<APIResponse> {
    const partners =
      await this.partnerConfigService.createConfiguration(config);
    return {
      status: HttpStatus.OK,
      message: partners,
    };
  }

  @Post(':id/merchant/:mid')
  async createMerchantConfiguration(
    @Param('id') partnerId: string,
    @Param('mid') merchantId: string,
    @Body() merchantConfig: any,
  ): Promise<APIResponse> {
    const newMerchantConfig =
      await this.partnerConfigService.createMerchantConfiguration(
        partnerId,
        merchantId,
        merchantConfig,
      );
    return {
      status: HttpStatus.OK,
      message: newMerchantConfig,
    };
  }

  @Delete(':id')
  async deleteConfiguration(
    @Param('id') partnerId: string,
  ): Promise<APIResponse> {
    const deleteResult =
      await this.partnerConfigService.deleteConfiguration(partnerId);
    return {
      status: HttpStatus.OK,
      message: deleteResult,
    };
  }
}
