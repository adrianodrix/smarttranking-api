import { IsPublic } from '@lib/common/auth/decorators/is-public.decorator';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @IsPublic()
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return await this.service.register(authRegisterUserDto);
  }

  @Post('login')
  @IsPublic()
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    try {
      const result: any = await this.service.login(authLoginUserDto);
      return {
        log: 'release testing 001',
        ...result,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
