import { HttpStatus } from '@nestjs/common';

export interface APIResponse {
  status: HttpStatus;
  message: string | object;
}
