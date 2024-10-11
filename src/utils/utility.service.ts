import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as fastCSV from 'fast-csv';
import { PassThrough } from 'stream';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';

@Injectable()
export class UtilityService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

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

  async streamFileToS3(streamURL: string, s3FilePath: string): Promise<string> {
    try {
      const response = await axios.get(streamURL, {
        responseType: 'arraybuffer',
      });
      const fileBuffer = Buffer.from(response.data);

      const uploadParams = {
        Bucket: await this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: s3FilePath,
        Body: fileBuffer,
      };

      const command = new PutObjectCommand(uploadParams);
      const uploadResult = await this.s3Client.send(command);

      console.log('File uploaded successfully to S3: ', uploadResult);
    } catch (error) {
      console.error('Error uploading/downloading file:', error);
      throw error;
    }

    return s3FilePath;
  }
}
