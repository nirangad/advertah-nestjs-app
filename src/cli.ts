// cli.ts
import { Command } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';

async function bootstrap() {
  // Create a Nest application context (does not listen to HTTP requests)
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the service that will handle the task
  const tasksService = app.get(TasksService);

  // Initialize commander
  const program = new Command();

  // Define the command and its options
  program
    .command('convert-data')
    .description('Convert data for a specific partner and merchant')
    .option('-p, --partner <partner>', 'Partner alias') // Partner option (-p or --partner)
    .option('-m, --merchant <merchant>', 'Merchant Index') // Merchant option (-m or --merchant)
    .action(async (options) => {
      const { partner, merchant } = options;

      // Validate inputs
      if (!partner || !merchant) {
        console.error(
          'Error: Both partner (-p) and merchant (-m) are required.',
        );
        process.exit(1);
      }

      // Trigger the task logic with the provided partner and merchant
      console.log(
        `Converting data for partner: ${partner}, merchant: ${merchant}`,
      );
      await tasksService.convertData(partner, merchant);

      // Close the Nest application context
      await app.close();
    });

  // Parse command line arguments
  program.parse(process.argv);
}

// Start the bootstrap function
bootstrap();
