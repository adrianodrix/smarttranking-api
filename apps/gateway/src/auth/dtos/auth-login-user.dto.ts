import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class AuthLoginUserDto {
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
}
