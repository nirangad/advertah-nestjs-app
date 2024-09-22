import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGreeting(): string {
    return 'Welcome to Advertah Product Listing API';
  }
}
