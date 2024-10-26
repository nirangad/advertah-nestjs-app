import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandOptionsOption, Option } from 'nestjs-command';
import { TasksService } from './tasks.service';

@Injectable()
export class TasksCommand {
  private readonly logger = new Logger(TasksCommand.name);

  constructor(private readonly tasksService: TasksService) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // readPartnerProductDataFeedTask() {
  //   this.logger.log('Reading Partner products feed...');
  //   this.tasksService.readProductFeedFile();
  //   this.logger.log('Reading Completed');
  // }

  @Command({
    command: 'convert-data',
    describe: 'Manually trigger the data conversion process',
  })
  async convertDataTask(
    @Option({
      name: 'partner',
      desc: 'Partner code',
      type: 'string',
      alias: 'p',
    })
    partner: string,
    @Option({
      name: 'merchant',
      desc: 'Absolute path for CSV file',
      type: 'string',
      alias: 'm',
    })
    merchant: string,
  ) {
    console.log('Starting manual data conversion task...', partner);
    try {
      await this.tasksService.convertData(partner, merchant);
    } catch (err) {
      console.error('INVALID PARAMETERS PROVIDED: ', err);
    } finally {
      console.log('Data conversion task completed.');
    }
  }

  @Command({
    command: 'fetch-data',
    describe: 'Manually trigger product feed fetching',
  })
  async fetchProductFeedsCommand(
    @Option({
      name: 'partner',
      desc: 'Partner ID',
      type: 'string',
      alias: 'p',
    } as CommandOptionsOption)
    partner: string,
    @Option({
      name: 'merchant',
      desc: 'Merchant ID',
      type: 'string',
      alias: 'm',
    })
    merchant: string,
  ) {
    if (!partner || !merchant) {
      throw Error(
        `Error: Both partner (-p) and merchant (-m) are required.
        Usage: npx nestjs-command fetch-data -p <PARTNER ID> -m <MERCHANT ID>`,
      );
    }

    try {
      console.log(
        'Update Product feed for Merchant [',
        merchant,
        '] of Partner [',
        partner,
        ']',
      );
      console.log('Please wait...');
      const s3FileName = await this.tasksService.downloadProductFeeds(
        partner,
        merchant,
      );
      console.log('Uploaded file: ', s3FileName);
    } catch (error) {
      console.error('Error while fetching data:', error);
      throw error;
    }
  }
}
