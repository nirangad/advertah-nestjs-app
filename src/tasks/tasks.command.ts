import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Command, Option } from 'nestjs-command';
import { TasksService } from './tasks.service';

@Injectable()
export class TasksCommand {
  private readonly logger = new Logger(TasksCommand.name);

  constructor(private readonly tasksService: TasksService) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  readPartnerProductDataFeedTask() {
    this.logger.log('Reading Partner products feed...');
    this.tasksService.readProductFeedFile();
    this.logger.log('Reading Completed');
  }

  @Command({
    command: 'convert-data',
    describe: 'Manually trigger the data conversion process',
  })
  async convertDataTask(
    @Option({
      name: 'partner',
      describe: 'Partner code',
      type: 'string',
      alias: 'p',
    })
    partner: string,
    @Option({
      name: 'merchant',
      describe: 'Absolute path for CSV file',
      type: 'string',
      alias: 'm',
    })
    merchant: number,
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
}
