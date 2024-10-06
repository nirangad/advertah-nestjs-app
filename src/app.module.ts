import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommandModule } from 'nestjs-command';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UtilityModule } from './utils/utility.module';

import { ProductsModule } from './products/products.module';
import { PartnerModule } from './partners/partner.module';
import { TasksModule } from './tasks/tasks.module';
import { join } from 'path';

@Module({
  providers: [AppService, ConfigService],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './data/raw_data/'),
    }),
    CommandModule,
    UtilityModule,
    ProductsModule,
    PartnerModule,
    TasksModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: `mongodb://${configService.get('MONGODB_USERNAME')}:${configService.get('MONGODB_PASSWORD')}@${configService.get('MONGODB_SERVER')}:${configService.get('MONGODB_PORT')}/${configService.get('MONGODB_DATABASE')}`,
          connectionFactory: (connection) => {
            connection.plugin((schema) => {
              schema.set('timestamps', true);
            });
            return connection;
          },
        };
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
