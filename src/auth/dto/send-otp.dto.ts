import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpDto {
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
}