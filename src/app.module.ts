import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UtilityModule } from './utils/utility.module';

import { ProductsModule } from './products/products.module';
import { PartnerModule } from './partners/partner.module';

const MONGODB_DATABSE = 'advertah_api_db';
const MONGODB_SERVER = 'localhost';
const MONGODB_PORT = '27017';
const MONGODB_USERNAME = 'adverta_nest_api';
const MONGODB_PASSWORD = 'Advertah%402024_API';
const connectionStr = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_SERVER}:${MONGODB_PORT}/${MONGODB_DATABSE}`;
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    UtilityModule,
    ProductsModule,
    PartnerModule,
    MongooseModule.forRoot(connectionStr, {
      connectionFactory: (connection) => {
        connection.plugin((schema) => {
          schema.set('timestamps', true);
        });
        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    const db = mongoose.connection;

    // Event listeners for the MongoDB connection status
    db.on('connecting', () => {
      console.log('[CUSTOM] >>>', 'Connecting to MongoDB...');
    });

    db.on('connected', () => {
      console.log('[CUSTOM] >>>', 'Connected to MongoDB');
    });

    db.on('error', (error) => {
      console.error('[CUSTOM] >>>', `MongoDB connection error: ${error}`);
    });

    db.on('disconnected', () => {
      console.log('[CUSTOM] >>>', 'Disconnected from MongoDB');
    });

    db.on('reconnected', () => {
      console.log('[CUSTOM] >>>', 'Reconnected to MongoDB');
    });

    db.on('reconnectFailed', () => {
      console.error('[CUSTOM] >>>', 'MongoDB reconnection failed');
    });
  }
}
