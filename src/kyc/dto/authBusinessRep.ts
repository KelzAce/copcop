import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail, IsBoolean, IsArray } from 'class-validator';

export class CooperativeOwnerDto {

  @IsString()
  @ApiProperty()
  fullName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(11, 11)
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  state: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  docUrl: string;

  @IsString()
  @ApiProperty()
  docType: string;

  @IsString()
  @ApiProperty()
  docNumber: string;
}

export class CreateCompanyOwnerDto {
  @IsArray()
  @ApiProperty({ type: [CooperativeOwnerDto] })
  cooperativeOwners: CooperativeOwnerDto[];
}
