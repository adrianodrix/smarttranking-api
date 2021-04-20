import { AWSCognitoService } from '@lib/common/aws/aws-cognito.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(private readonly aws: AWSCognitoService) {}

  async register(authRegisterUserDto: AuthRegisterUserDto) {
    this.logger.log(`register: ${JSON.stringify(authRegisterUserDto)}`);
    const { name, email, phoneNumber, password } = authRegisterUserDto;
    const phoneNumberFormated = phoneNumber
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/-/g, '')
      .replace(/\s/g, '');
    this.logger.log(`phoneNumberFormated: ${phoneNumberFormated}`);

    return new Promise((resolve, reject) => {
      this.aws.getUserPool().signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumberFormated,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async login(authLoginUserDto: AuthLoginUserDto) {
    this.logger.log(`login: ${JSON.stringify(authLoginUserDto)}`);
    const { email, password } = authLoginUserDto;
    const userData = {
      Username: email,
      Pool: this.aws.getUserPool(),
    };
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (error) => reject(error),
      });
    });
  }
}
