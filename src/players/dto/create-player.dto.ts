import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(10, 80)
  name: string;
}
