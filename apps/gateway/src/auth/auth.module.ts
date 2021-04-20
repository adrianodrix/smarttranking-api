import { AWSModule } from '@lib/common/aws/aws.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { JWTStrategy } from './jwt.strategy';

@Module({
  imports: [AWSModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, AWSModule, JWTStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
