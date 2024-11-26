import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANTS } from './constants';
// import mongoose from 'mongoose';

async function bootstrap() {
  // mongoose.set('debug', true);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:4200',
        'https://ae.advertah.com',
        'https://us.advertah.com',
        'https://uk.advertah.com',
        'app.advertah.com',
      ];

      // Allow requests with no origin (e.g., mobile apps, curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(CONSTANTS.port);
}

bootstrap();
