import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as fastCSV from 'fast-csv';

@Injectable()
export class UtilityService {
  objectToKeyValueString(obj: Record<string, any>): string[] {
    return Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  }

  async loadCSV(
    csvFile: string,
    delimiter: string = ',',
    callbackRead: (data: any) => void,
    callbackComplete: (data: any) => void,
  ) {
    const stream = fs.createReadStream(csvFile);
    const csvData = [];
    const csvStream = fastCSV
      .parse({ headers: true, delimiter: delimiter })
      .on('data', (row) => {
        csvData.push(row);
        callbackRead(row);
      })
      .on('end', () => {
        callbackComplete(csvData);
        console.log('CSV file successfully processed');
      })
      .on('error', (error) => {
        console.error('Error while reading CSV file:', error);
      });

    stream.pipe(csvStream);
  }
}
