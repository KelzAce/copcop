import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, Length } from 'class-validator';
import { BusinessCategory, KycType } from '../entities/enums';

export class VerifyBankDetailsDto {
  @IsString()
  @ApiProperty()
  bank_code: string;

  @IsString()
  @ApiProperty()
  number: string;
}

export class BankDetailsDto {
  @IsEnum(KycType)
  @ApiProperty()
  kycType: KycType;

  @IsString()
  @ApiProperty()
  bankName: string;

  @IsString()
  @ApiProperty()
  acctName: string;

  @IsString()
  @ApiProperty()
  acctNo: string;

  @IsString()
  @Length(11, 11)
  @IsOptional()
  @ApiProperty()
  bvn: string;

  @IsEnum(BusinessCategory)
  @IsOptional()
  @ApiProperty()
  businessCategory: BusinessCategory;
}

export class VerifyBvnDto {
  @IsString()
  @Length(11, 11)
  @ApiProperty()
  number: string;
}
