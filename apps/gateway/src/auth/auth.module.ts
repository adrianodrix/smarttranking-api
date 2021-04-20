import { AWSModule } from '@lib/common/aws/aws.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [AWSModule],
  controllers: [AuthController],
  providers: [AuthService, AWSModule],
})
export class AuthModule {}
