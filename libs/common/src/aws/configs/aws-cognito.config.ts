import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSCognitoConfig {
  constructor(private readonly configs: ConfigService) {}

  public userPoolId: string = this.configs.get<string>(
    'AWS_COGNITO_USER_POOL_ID',
  );
  public clientId: string = this.configs.get<string>('AWS_COGNITO_CLIENT_ID');
  public region: string = this.configs.get<string>(
    'AWS_COGNITO_REGION',
    'us-east-1',
  );
  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
