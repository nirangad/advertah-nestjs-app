import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilityModule } from './utils/utility.module';

import { ProductsModule } from './products/products.module';
import { PartnerModule } from './partners/partner.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  providers: [AppService, ConfigService],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mUser = await configService.get('MONGODB_USERNAME');
        const mPass = await configService.get('MONGODB_PASSWORD');
        const mServer = await configService.get('MONGODB_SERVER');
        const mPort = await configService.get('MONGODB_PORT');
        const mDatabase = await configService.get('MONGODB_DATABASE');
        const connectionString = `mongodb://${mUser}:${mPass}@${mServer}:${mPort}/${mDatabase}`;

        console.log('MongoDB Connection Details:');
        console.log('Username:', mUser);
        console.log('Password:', mPass);
        console.log('Server:', mServer);
        console.log('Port:', mPort);
        console.log('Database:', mDatabase);
        console.log(
          'Connection String:',
          `mongodb://${mUser}:${mPass}@${mServer}:${mPort}/${mDatabase}`,
        );

        return {
          uri: connectionString,
          connectionFactory: (connection) => {
            connection.plugin((schema) => {
              schema.set('timestamps', true);
            });
            return connection;
          },
        } as MongooseModuleOptions;
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
