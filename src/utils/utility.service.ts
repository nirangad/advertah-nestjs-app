import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as fastCSV from 'fast-csv';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import axios from 'axios';
import { Readable } from 'stream';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class UtilityService {
  private readonly logger = new Logger(UtilityService.name);

  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    const dbLifecycle = () => {
      this.connection.on('connected', () => {
        this.logger.log('\t[DB CONNECTION] Mongoose connection established');
      });

      // Event when MongoDB is disconnected
      this.connection.on('disconnected', () => {
        this.logger.warn('\t[DB CONNECTION] Mongoose connection disconnected');
      });

      // Event when MongoDB reconnects
      this.connection.on('reconnected', () => {
        this.logger.log('\t[DB CONNECTION] Mongoose reconnected');
      });

      // Event when MongoDB encounters an error
      this.connection.on('error', (error) => {
        this.logger.error(
          `\t[DB CONNECTION] Mongoose connection error: ${error}`,
        );
      });

      // Event for reconnection failure
      this.connection.on('reconnectFailed', () => {
        this.logger.error('\t[DB CONNECTION] Mongoose reconnection failed');
      });
    };
    dbLifecycle();
  }

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

  async loadCSVFromS3(
    s3FilePath: string,
    delimiter: string = ',',
    callbackRead: (data: any) => void,
    callbackComplete: (data: any) => void,
  ) {
    try {
      console.warn('\n\n\t\t[CSV S3 FILE]: \n', s3FilePath);
      const command = new GetObjectCommand({
        Bucket: await this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: s3FilePath,
      });

      const response = await this.s3Client.send(command);
      const fileStream = response.Body as Readable;

      const csvStream = fastCSV
        .parse({ headers: true, delimiter: delimiter })
        .on('data', async (row) => {
          await callbackRead(row);
        })
        .on('end', async (rowCount: number) => {
          await callbackComplete(rowCount);
        })
        .on('error', (error) => {
          console.error('Error while reading CSV file:', error);
          throw error;
        });

      return await fileStream.pipe(csvStream);
    } catch (error) {
      console.error(
        'Something went wrong while streaming CSV file',
        s3FilePath,
      );
      throw error;
    }
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

  async checkS3FileExists(s3FilePath: string) {
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: await this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: s3FilePath,
      });
      await this.s3Client.send(headCommand);
      return true;
    } catch {
      console.error('File does not exists in S3', s3FilePath);
      return false;
    }
  }

  typeCast(value, castTo) {
    switch (castTo) {
      case 'Boolean':
        return this.toBoolean(value);
      case 'Number':
        return this.toNumber(value);
      default:
        return value;
    }
  }

  toBoolean(value): boolean {
    if (value === undefined || value == null) {
      return false;
    }
    return value.toString().toLowerCase().trim() === 'true';
  }

  toNumber(value): number {
    return parseFloat(value) || 0;
  }
}
