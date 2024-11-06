import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PartnerService } from 'src/partners/partner.service';

@Injectable()
export class TasksCron {
  private readonly logger = new Logger(TasksCron.name);
  private readProductFeedCronJobMutex: boolean = false;
  private convertProductFeedCronJobMutex: boolean = false;

  constructor(
    private readonly tasksService: TasksService,
    private readonly partnerService: PartnerService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async readPartnerProductFeedCronJob() {
    if (this.readProductFeedCronJobMutex) {
      this.logger.warn(
        '[Fetch Product Feed] Previous run is still in progress. Exiting the Cron Job',
      );
      return;
    }
    this.readProductFeedCronJobMutex = true;
    const partners = await this.partnerService.getAllPartners();
    try {
      for (const partner of partners) {
        let merchant: any;
        for (merchant of partner.merchants) {
          try {
            this.logger.log(`[Scheduled Update] Fetch Product feed`);
            this.logger.log(
              `Merchant [${merchant.merchant_id} | ${merchant.name}] of Partner [ ${partner.partner_id} | ${partner.name} ]`,
            );
            this.logger.log('Please wait...');
            const s3FileName = await this.tasksService.downloadProductFeeds(
              partner.partner_id,
              merchant.merchant_id,
            );
            this.logger.log('Uploaded file: ', s3FileName);

            this.logger.log(`[Scheduled Update] Update Product Database`);
            this.logger.log(
              `Merchant [${merchant.merchant_id} | ${merchant.name}] of Partner [ ${partner.partner_id} | ${partner.name} ]`,
            );
            this.logger.log('Please wait...');
            await this.tasksService.convertData(partner.partner_id, merchant);
          } catch (error) {
            this.logger.error('Error while fetching data:', error);
          }
        }
      }
    } catch (error) {
      this.logger.error(
        'Error while fetching data. Exiting the Cron Job',
        error,
      );
    } finally {
      this.readProductFeedCronJobMutex = false;
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async updateFromProductFeedCronJob(partners) {
    if (
      this.readProductFeedCronJobMutex ||
      this.convertProductFeedCronJobMutex
    ) {
      this.logger.warn(
        '[Convert Product Feed] Previous run is still in progress. Exiting the Cron Job',
      );
      return;
    }
    this.convertProductFeedCronJobMutex = true;

    try {
      for (const partner of partners) {
        let merchant: any;
        for (merchant of partner.merchants) {
          try {
            this.logger.log(`[Scheduled Update] Product Database`);
            this.logger.log(
              `Merchant [${merchant.merchant_id} | ${merchant.name}] of Partner [ ${partner.partner_id} | ${partner.name} ]`,
            );
            this.logger.log('Please wait...');
            await this.tasksService.convertData(partner, merchant);
          } catch (error) {
            this.logger.error('Error while converting data:', error);
          }
        }
      }
    } catch (error) {
      this.logger.error(
        'Error while converting data. Exiting the Cron Job',
        error,
      );
    } finally {
      this.convertProductFeedCronJobMutex = false;
    }
  }
}
