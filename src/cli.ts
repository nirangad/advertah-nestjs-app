import { Command } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tasksService = app.get(TasksService);

  // Initialize commander
  const program = new Command();
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
