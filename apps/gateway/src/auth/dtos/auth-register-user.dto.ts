import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class AuthRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  /*
        - Minimo 8 caracteres
        - uma letra maiuscula
        - uma letra minuscula
        - um numero
    */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'senha inválida',
  })
  password: string;

  @IsMobilePhone('pt-BR')
  phoneNumber: string;
}
