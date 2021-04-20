import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return await this.service.register(authRegisterUserDto);
  }

  @Post('login')
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    try {
      return await this.service.login(authLoginUserDto);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
