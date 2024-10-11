import { Command } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';
import { PartnerConfigurationService } from './partners/partner.config.service';

async function bootstrap() {
  // Loading AppModule to load dependencies
  const app = await NestFactory.createApplicationContext(AppModule);

  // Services
  const tasksService = app.get(TasksService);
  const partnerConfigService = app.get(PartnerConfigurationService);

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

      try {
        console.log(
          'Update Product feed for Merchant [',
          merchant,
          '] of Partner [',
          partner,
          ']',
        );
        console.log('Please wait...');
        const s3FileName = await tasksService.downloadProductFeeds(
          partner,
          merchant,
        );

        const merchantConfig =
          await partnerConfigService.updateMerchantS3FilePath(
            s3FileName,
            merchant,
          );

        console.log('Uploaded file: ', s3FileName);
        console.log('Merchant Configuration: ', merchantConfig);
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
    .description('Convert data for a specific partner and merchant')
    .option('-p, --partner <partner>', 'Partner alias')
    .option('-m, --merchant <merchant>', 'Merchant Index')
    .action(async (options) => {
      const { partner, merchant } = options;

      if (!partner || !merchant) {
        console.error(
          'Error: Both partner (-p) and merchant (-m) are required.',
        );
        process.exit(1);
      }

      console.log(
        `Converting data for partner: ${partner}, merchant: ${merchant}`,
      );
      await tasksService.convertData(partner, merchant);
      await app.close();
    });

  // Parse command line arguments
  program.parse(process.argv);
}
bootstrap();
