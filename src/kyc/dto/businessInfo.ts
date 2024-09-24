import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, ValidateNested } from 'class-validator';
import { SocialMediaDto } from './socialMediaDto';
import { Type } from 'class-transformer';

export class BusinessInfoDto {
  @IsString()
  @ApiProperty()
  businessName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  tradingName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  supportEmail: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  supportPhone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  businessType: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyRegistrationNumber: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  trusteeBvn: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  trustee2Bvn: string;

  @IsString()
  @ApiProperty()
  estimatedMonthlySale: string;

  @ValidateNested()
  @ApiProperty({ type: SocialMediaDto })
  @Type(() => SocialMediaDto)
  socialMedia: SocialMediaDto;
}

export class SendPhoneVerifyOtpDto {
  @IsString()
  @ApiProperty()
  phone: string;
}
