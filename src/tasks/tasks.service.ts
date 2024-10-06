import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { UtilityService } from 'src/utils/utility.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  private readonly assetsRawDataFiles = {
    default: {
      partner: 'admitad',
      merchant: 0,
    },
    admitad: {
      root: 'raw_data/Admitad',
      files: [
        'Boutiquefeel WW_25189.csv',
        'ChicMe WW_25181.csv',
        'Cotosen WW_24921.csv',
        'Geekbuying WW_15502.csv',
        'Glasseslit WW_17760.csv',
        'Gshopper Many GEOs_25701.csv',
        'Wayrates WW_21839.csv',
      ],
    },
    awin: {
      root: 'raw_data/Awin',
      files: ['Cronjager.csv', 'Dunleath.csv'],
    },
  };

  constructor(private readonly utilityService: UtilityService) {}
  async readProductFeedFile(
    partner: string | undefined = undefined,
    merchant: number | undefined = undefined,
  ) {
    if (!partner || !merchant) {
      partner = this.assetsRawDataFiles.default.partner;
      merchant = this.assetsRawDataFiles.default.merchant;
    }

    if (!this.assetsRawDataFiles[partner]) {
      throw new TypeError(`Unknown Partner: ${partner}`);
    }

    if (!this.assetsRawDataFiles[partner].files[merchant]) {
      throw new TypeError(`Unknown Merchant: ${partner} => ${merchant}`);
    }

    const csvPath = join(
      __dirname,
      '..',
      '..',
      'assets',
      this.assetsRawDataFiles[partner].root,
      this.assetsRawDataFiles[partner].files[merchant],
    );

    const csvFile = [];
    await this.utilityService.loadCSV(
      csvPath,
      ';',
      (row) => {
        csvFile.push(row);
      },
      (csvData) => {
        console.log(
          '[CRON COMPLETE]:  ',
          csvData.length,
          csvData[0],
          csvData[1],
        );
      },
    );
  }

  convertData(partner: string, merchant: number) {
    this.logger.log(
      'Reading Partner products feed...',
      `Partner: ${partner}`,
      `Merchant: ${this.assetsRawDataFiles[partner].files[merchant]}`,
    );
    this.readProductFeedFile(partner, merchant);
    this.logger.log('Reading Completed');
  }
}
