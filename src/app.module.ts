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
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, './data/raw_data/'),
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connectionString = `mongodb://${await configService.get('MONGODB_USERNAME')}:${await configService.get('MONGODB_PASSWORD')}@${await configService.get('MONGODB_SERVER')}:${await configService.get('MONGODB_PORT')}/${await configService.get('MONGODB_DATABASE')}`;
        return {
          uri: connectionString,
          connectionFactory: (connection) => {
            connection.plugin((schema) => {
              schema.set('timestamps', true);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    CommandModule,
    UtilityModule,
    ProductsModule,
    PartnerModule,
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor() {}
}
