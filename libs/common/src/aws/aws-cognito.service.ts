import { Injectable, Logger } from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { AWSCognitoConfig } from './configs/aws-cognito.config';

@Injectable()
export class AWSCognitoService {
  private logger = new Logger(AWSCognitoService.name);
  private userPool: CognitoUserPool;

  constructor(private readonly authConfig: AWSCognitoConfig) {
    const { userPoolId: UserPoolId, clientId: ClientId } = this.authConfig;
    this.userPool = new CognitoUserPool({
      UserPoolId,
      ClientId,
    });
  }

  getUserPool(): CognitoUserPool {
    return this.userPool;
  }
}
