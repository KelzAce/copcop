import { Matches, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  @Transform(
    (params: { value: string }) => {
      const value: string = params.value;
      return value.trim().toLowerCase();
    },
    { toClassOnly: true },
  )
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  otp: string;
}
