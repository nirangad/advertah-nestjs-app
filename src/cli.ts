import { Command } from 'commander';
import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';
// import mongoose from 'mongoose';

async function bootstrap() {
  // mongoose.set('debug', true);
  // Loading AppModule to load dependencies
  const app = await NestFactory.createApplicationContext(AppModule);

  // Services
  const tasksService = app.get(TasksService);

  // Initialize commander
  const program = new Command();

  // Usage:
  // npx nestjs-command fetch-data -p <PARTNER ID> -m <MERCHANT ID>
  program
    .command('fetch-data')
    .description('Manually trigger product feed fetching for partners')
    .option('-p, --partner <partner>', 'Partner ID')
    .option('-m, --merchant <merchant>', 'Merchant ID')
    .action(async (options) => {
      const { partner, merchant } = options;
      if (!partner || !merchant) {
        console.error(
          'Error: Both partner (-p) and merchant (-m) are required.',
          'Usage: npx nestjs-command fetch-data -p <PARTNER ID> -m <MERCHANT ID>',
        );
        process.exit(1);
      }

      console.log(
        'Updating Product feed for Merchant [',
        merchant,
        '] of Partner [',
        partner,
        ']',
      );
      console.log('Please wait...');

      try {
        const s3FileName = await tasksService.downloadProductFeeds(
          partner,
          merchant,
        );

        console.log('Uploaded file: ', s3FileName);
      } catch (error) {
        console.error('Error while fetching data:', error);
        process.exit(1);
      } finally {
        await app.close();
      }
    });

  // Usage:
  // npx nestjs-command convert-data -p <PARTNER ID> -m <MERCHANT ID>
  program
    .command('convert-data')
    .description('Convert data for a Partner and Merchant')
    .option('-p, --partner <partner>', 'Partner ID')
    .option('-m, --merchant <merchant>', 'Merchant ID')
    .action(async (options) => {
      const { partner, merchant } = options;

      if (!partner || !merchant) {
        console.error(
          'Error: Both partner (-p) and merchant (-m) are required.',
          'Usage: npx nestjs-command convert-data -p <PARTNER ID> -m <MERCHANT ID>',
        );
        process.exit(1);
      }

      console.log(
        'Converting Product feed for Merchant [',
        merchant,
        '] of Partner [',
        partner,
        ']',
      );

      try {
        await tasksService.convertData(partner, merchant);
      } catch (error) {
        console.error('Error while converting data:', error);
        process.exit(1);
      } finally {
        //await app.close();
      }
    });

  // Parse command line arguments
  await program.parseAsync(process.argv);
}
bootstrap();
