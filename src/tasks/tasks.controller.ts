import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { APIResponse } from 'src/app.types';
import { TasksService } from './tasks.service';
import { PartnerConfigurationService } from 'src/partners/partner.config.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly partnerConfigService: PartnerConfigurationService,
  ) {}

  // @Get('fetch-data')
  fetchData(): APIResponse {
    const connectionList = {
      '25186': ['25189', '25181', '24921', '15502', '17760', '25701', '21839'],
      awin_ltd: ['58637', '98661'],
    };

    for (const [partner, merchants] of Object.entries(connectionList)) {
      console.log('Partner:', partner);
      console.log('===========================================');
      merchants.forEach(async (merchant) => {
        console.log('Merchant:', merchant);
        console.log('-------------------------------------------');
        try {
          const s3FileName = await this.tasksService.downloadProductFeed(
            partner,
            merchant,
          );

          console.log('Uploaded file: ', s3FileName);
        } catch (error) {
          console.error('Partner: ', partner, 'Merchant: ', merchant);
          console.error('Error while fetching data:', error);
        }
      });
    }
    return {
      status: HttpStatus.OK,
      message: {},
    };
  }

  // @Get('convert-data')
  async convertData(): Promise<APIResponse> {
    const connectionList = {
      '25186': ['25189', '25181', '24921', '15502', '17760', '25701', '21839'],
      awin_ltd: ['58637', '98661'],
    };

    for (const [partner, merchants] of Object.entries(connectionList)) {
      merchants.forEach(async (merchant) => {
        console.log('Partner: ', partner, 'Merchant:', merchant);
        try {
          await this.tasksService.convertData(partner, merchant);
        } catch (error) {
          console.error('Error while converting data:', error);
        }
      });
    }
    return {
      status: HttpStatus.OK,
      message: {},
    };
  }

  @Get('convert-data/:partnerId/:merchantId')
  async convertDataForMerchant(
    @Param('partnerId') partner: string,
    @Param('merchantId') merchant: string,
  ): Promise<APIResponse> {
    console.log('Partner: ', partner, 'Merchant:', merchant);
    try {
      await this.tasksService.convertData(partner, merchant);
    } catch (error) {
      console.error('Error while converting data:', error);
      return {
        status: HttpStatus.OK,
        message: {},
      };
    }
    return {
      status: HttpStatus.OK,
      message: {},
    };
  }
}
