import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class UpdatePlayerDTO {
  @IsEmpty()
  readonly email: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @Length(10, 80)
  name: string;
}
