import { Module } from '@nestjs/common';
import { AWSSESService } from './aws-ses.service';
import { AWSService } from './aws.service';

@Module({
  providers: [AWSService, AWSSESService],
  exports: [AWSService, AWSSESService],
})
export class AWSModule {}
