import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  objectToKeyValueString(obj: Record<string, any>): string[] {
    return Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  }
}
