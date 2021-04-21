import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { IEmailParams } from './interfaces/email-params.interface';
import { IEmailWithTemplateParams } from './interfaces/email-template-params.interface';

@Injectable()
export class AWSSESService {
  private logger = new Logger(AWSSESService.name);

  constructor(private readonly configs: ConfigService) {
    const awsConfig = {
      accessKeyId: configs.get<string>('AWS_SES_ACCESS_KEY'),
      secretAccessKey: configs.get<string>('AWS_SES_SECRET_ACCESS_KEY'),
      region: configs.get<string>('AWS_SES_REGION', 'us-east-1'),
    };
    AWS.config.update(awsConfig);
  }

  async sendEmail(params: IEmailParams) {
    try {
      const result = await new AWS.SES({
        apiVersion: this.configs.get<string>(
          'AWS_SES_API_VERSION',
          '2010-12-01',
        ),
      })
        .sendEmail(params)
        .promise();
      this.logger.log(`result: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendEmailWithTemplate(params: IEmailWithTemplateParams) {
    try {
      const result = await new AWS.SES({
        apiVersion: this.configs.get<string>(
          'AWS_SES_API_VERSION',
          '2010-12-01',
        ),
      })
        .sendTemplatedEmail(params)
        .promise();
      this.logger.log(`result: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
