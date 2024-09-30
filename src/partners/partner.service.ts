import { HttpStatus, Injectable } from '@nestjs/common';
import { APIResponse } from '../app.types';
import { PartnerSearchParams } from './partner.types';
import { UtilityService } from 'src/utils/utility.service';
import { Partner, PartnerAPI } from 'src/data/models/schemas/partner.schema';

@Injectable()
export class PartnerService {
  constructor(private readonly utilityService: UtilityService) {}

  getPartners(): APIResponse {
    return {
      status: HttpStatus.OK,
      message: ['Partner 01', 'Partner 02', 'Partner 03'],
    };
  }

  searchPartners(params: PartnerSearchParams): APIResponse {
    console.log(params);
    return {
      status: HttpStatus.OK,
      message: params,
    };
  }

  getAPILinks(partner: Partner): APIResponse {
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
