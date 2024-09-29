import { Controller, Get, Query } from '@nestjs/common';
import { APIResponse } from 'src/app.types';
import { PartnerService } from './partner.service';
import {
  Partner,
  PartnerSearchParams,
  ProductFeedFormat,
} from './partner.types';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  getProducts(): APIResponse {
    return this.partnerService.getPartners();
  }

  @Get('/search')
  searchProducts(
    @Query('query') query: string,
    @Query('format') format: ProductFeedFormat,
    @Query('active') active: boolean,
  ): APIResponse {
    const params: PartnerSearchParams = {
      query,
      format,
      active,
    };
    return this.partnerService.searchPartners(params);
  }

  @Get()
  getAPILinks(partner: Partner): APIResponse {
    return this.partnerService.getAPILinks(partner);
  }
}
