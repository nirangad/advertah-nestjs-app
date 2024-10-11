import { Injectable, Logger } from '@nestjs/common';
import { PartnerConfigurationService } from 'src/partners/partner.config.service';
import { PartnerService } from 'src/partners/partner.service';
import { UtilityService } from 'src/utils/utility.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly utilityService: UtilityService,
    private readonly partnerService: PartnerService,
    private readonly partnerConfigurationService: PartnerConfigurationService,
  ) {}
  async readProductFeedFile(
    partner: string | undefined = undefined,
    merchant: number | undefined = undefined,
  ) {
    if (!partner || !merchant) {
      this.logger.error('Partner and/or Merchant params are missing');
    }
  }

  convertData(partnerId: string, merchantId: string) {
    //this.readProductFeedFile(partner, merchant);
    this.logger.log(partnerId, merchantId, 'Reading Completed');
  }

  async downloadProductFeeds(partnerId: string, merchantId: string) {
    const { feedURL, s3FilePath } =
      await this.partnerService.getMerchantProductFeedURL(
        partnerId,
        merchantId,
      );
    const s3FilePathString =
      s3FilePath instanceof Promise ? await s3FilePath : s3FilePath;
    return await this.utilityService.streamFileToS3(feedURL, s3FilePathString);
  }
}
