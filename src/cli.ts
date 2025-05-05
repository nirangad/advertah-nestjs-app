import { Command } from 'commander';
import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';
import { PartnerService } from './partners/partner.service';
// import mongoose from 'mongoose';

async function bootstrap() {
  // mongoose.set('debug', true);
  // Loading AppModule to load dependencies
  const app = await NestFactory.createApplicationContext(AppModule);

  // Services
  const tasksService = app.get(TasksService);
  const partnerService = app.get(PartnerService);

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
        const s3FileName = await tasksService.downloadProductFeed(
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
        console.warn('Entering convert-data try block...');
        await tasksService.convertData(partner, merchant);
        console.warn('Exiting convert-data try block...');
        await app.close();
      } catch (error) {
        console.error('Error while converting data:', error);
        process.exit(1);
      }
    });

  // Usage:
  // npx nestjs-command update-products
  program
    .command('update-products')
    .description('Convert data for a Partner and Merchant')
    .option('-p, --partner <partner>', 'Partner ID')
    .option('-m, --merchant <merchant>', 'Merchant ID')
    .action(async () => {
      const partners = await partnerService.getAllPartners();
      try {
        for (const partner of partners) {
          let merchant: any;
          for (merchant of partner.merchants) {
            try {
              console.log(`[CLI Update] Fetch Product feed`);
              console.log(
                `Merchant [${merchant.merchant_id} | ${merchant.name}] of Partner [ ${partner.partner_id} | ${partner.name} ]`,
              );
              console.log('Please wait...');
              const s3FileName = await tasksService.downloadProductFeed(
                partner.partner_id,
                merchant.merchant_id,
              );
              console.log('Uploaded file: ', s3FileName);
            } catch (error) {
              console.error('Error while fetching data:', error);
            }

            try {
              console.log(`[CLI Update] Product Database`);
              console.log(
                `Merchant [${merchant.merchant_id} | ${merchant.name}] of Partner [ ${partner.partner_id} | ${partner.name} ]`,
              );
              console.log('Please wait...');
              await tasksService.convertData(
                partner.partner_id,
                merchant.merchant_id,
              );
            } catch (error) {
              console.error('Error while converting data:', error);
            }
          }
        }
        console.log('[CLI Update] updateFromProductFeedCronJob');
      } catch (error) {
        console.error('Error while fetching data. Exiting the CLI', error);
      }
    });

  // Parse command line arguments
  await program.parseAsync(process.argv);
}

bootstrap();
