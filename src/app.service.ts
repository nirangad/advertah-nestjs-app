import { HttpStatus, Injectable } from '@nestjs/common';
import { APIResponse } from './app.types';

@Injectable()
export class AppService {
  getGreeting(): APIResponse {
    return {
      status: HttpStatus.OK,
      message: 'Welcome to Advertah Product Listing API v1.0',
    };
  }
}
