import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyPaymentAuthCodeDto {
  @ApiProperty()
  @IsString()
  public code: string;

  @ApiProperty()
  @IsString()
  public phone: string;
}
