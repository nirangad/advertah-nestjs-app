import { Controller, Get, HttpStatus } from '@nestjs/common';
import { APIResponse } from 'src/app.types';
import { TasksService } from './tasks.service';
import { PartnerConfigurationService } from 'src/partners/partner.config.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly partnerConfigService: PartnerConfigurationService,
  ) {}

  @Get('/fetch-data')
  getGreeting(): APIResponse {
    // npx nestjs-command fetch-data -p 25186 -m 25189
    // npx nestjs-command fetch-data -p 25186 -m 25181
    // npx nestjs-command fetch-data -p 25186 -m 24921
    // npx nestjs-command fetch-data -p 25186 -m 15502
    // npx nestjs-command fetch-data -p 25186 -m 17760
    // npx nestjs-command fetch-data -p 25186 -m 25701
    // npx nestjs-command fetch-data -p 25186 -m 21839
    // npx nestjs-command fetch-data -p awin_ltd -m 58637
    // npx nestjs-command fetch-data -p awin_ltd -m 98661
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
          const s3FileName = await this.tasksService.downloadProductFeeds(
            partner,
            merchant,
          );

          const merchantConfig =
            await this.partnerConfigService.updateMerchantS3FilePath(
              s3FileName,
              merchant,
            );

          if (!merchantConfig) {
            console.error('Updating Merchant product feed file path failed');
          }
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
}
