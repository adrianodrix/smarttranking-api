import { Module } from '@nestjs/common';
import { AWSCognitoService } from './aws-cognito.service';
import { AWSSESService } from './aws-ses.service';
import { AWSService } from './aws.service';
import { AWSCognitoConfig } from './configs/aws-cognito.config';

@Module({
  imports: [AWSCognitoConfig],
  providers: [AWSService, AWSSESService, AWSCognitoService, AWSCognitoConfig],
  exports: [AWSService, AWSSESService, AWSCognitoService, AWSCognitoConfig],
})
export class AWSModule {}
