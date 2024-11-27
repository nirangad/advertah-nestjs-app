import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PartnerService } from 'src/partners/partner.service';

@Injectable()
export class TasksCron {
  private readonly logger = new Logger(TasksCron.name);
  private readProductFeedCronJobMutex: boolean = false;
  private convertProductFeedCronJobMutex: boolean = false;

  private readonly partnerList = [
    ['25186', '25189', '25181', '24921', '15502', '17760', '25701', '21839'],
    ['awin_ltd', '58637', '98661'],
  ];
  private partnerPointer: number = 0;
  private merchantPointer: number = 1;

  constructor(
    private readonly tasksService: TasksService,
    private readonly partnerService: PartnerService,
  ) {}

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron('30 21 * * *')
  @Cron('06 16 * * *')
  async readPartnerProductFeedCronJob() {
    if (this.readProductFeedCronJobMutex) {
      this.logger.warn(
        '[Fetch Product Feed] Previous run is still in progress. Exiting the Cron Job',
      );
      return;
    }
    console.time('CRON [readPartnerProductFeedCronJob]');
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
            const s3FileName = await this.tasksService.downloadProductFeed(
              partner.partner_id,
              merchant.merchant_id,
            );
            this.logger.log('Uploaded file: ', s3FileName);
          } catch (error) {
            this.logger.error('Error while fetching data:', error);
          }
        }
      }
      this.readProductFeedCronJobMutex = false;
      console.timeEnd('CRON [readPartnerProductFeedCronJob]');
      await this.updateFromProductFeedCronJob(partners);
    } catch (error) {
      this.logger.error(
        'Error while fetching data. Exiting the Cron Job',
        error,
      );
    } finally {
      this.readProductFeedCronJobMutex = false;
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS) // 40 17 * * *
  // @Cron('53 17 * * *')
  async updateFromProductFeedCronJob(partners = []) {
    if (
      this.readProductFeedCronJobMutex ||
      this.convertProductFeedCronJobMutex
    ) {
      this.logger.warn(
        '[Convert Product Feed] Previous run is still in progress. Exiting the Cron Job',
      );
      return;
    }
    if (partners.length == 0) {
      partners = await this.partnerService.getAllPartners();
    }

    console.time('CRON [updateFromProductFeedCronJob]');
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
            await this.tasksService.convertData(
              partner.partner_id,
              merchant.merchant_id,
            );
          } catch (error) {
            this.logger.error('Error while converting data:', error);
          }
        }
      }
      this.convertProductFeedCronJobMutex = false;
      console.timeEnd('CRON [updateFromProductFeedCronJob]');
    } catch (error) {
      this.logger.error(
        'Error while converting data. Exiting the Cron Job',
        error,
      );
    } finally {
      this.convertProductFeedCronJobMutex = false;
    }
  }

  // @Cron('0 */2 * * * *')
  async updateFromSingleProductFeedCronJob() {
    const partner = this.partnerList[this.partnerPointer][0];
    const merchant =
      this.partnerList[this.partnerPointer][this.merchantPointer];
    try {
      this.logger.log(`[Scheduled Update] Product Database`);
      this.logger.log(`Merchant [${merchant}] of Partner [${partner}]`);
      this.logger.log('Please wait...');
      await this.tasksService.convertData(partner, merchant);
      this.logger.log(
        `Conversion Complete: Merchant [${merchant}] of Partner [${partner}]`,
      );

      // Update Pointers
      this.merchantPointer += 1;
      if (
        this.merchantPointer == this.partnerList[this.partnerPointer].length
      ) {
        this.merchantPointer = 1;
        this.partnerPointer += 1;
        this.partnerPointer = this.partnerPointer % this.partnerList.length;
      }
      this.logger.log(
        `Next Conversion: Partner Pointer [${this.partnerPointer}] | Merchant Pointer [${this.merchantPointer}]`,
      );
    } catch (error) {
      this.logger.error('Error while converting data:', error);
    }
  }
}
