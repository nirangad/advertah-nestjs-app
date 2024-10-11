import { Module, Global } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { fromIni } from '@aws-sdk/credential-providers';

@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: async (configService: ConfigService) => {
        const awsProfile = await configService.get('AWS_CLI_PROFILE');
        const awsS3Region = await configService.get('AWS_S3_REGION');
        const credentials = fromIni({ profile: awsProfile });

        return new S3Client({
          region: awsS3Region,
          credentials: credentials,
        });
      },
      inject: [ConfigService],
    },
    UtilityService,
  ],
  exports: [UtilityService],
})
export class UtilityModule {}
