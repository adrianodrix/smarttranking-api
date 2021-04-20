import { AWSCognitoConfig } from '@lib/common/aws/configs/aws-cognito.config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(JWTStrategy.name);

  constructor(private readonly configsAuth: AWSCognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: configsAuth.clientId,
      issuee: configsAuth.authority,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configsAuth.authority}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    this.logger.log(`validate (payload): ${JSON.stringify(payload)}`);
    const { sub: _id, email, name, phone_number: phoneNumber } = payload;

    return {
      _id,
      email,
      name,
      phoneNumber,
    };
  }
}
