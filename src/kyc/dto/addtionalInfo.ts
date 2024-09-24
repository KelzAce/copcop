import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { SocialMediaDto } from './socialMediaDto';
import { Type } from 'class-transformer';

export class AddtionalInfoDto {
  @IsString()
  @ApiProperty()
  country: string;

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
  @IsOptional()
  @ApiProperty()
  identityDocUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  identityDocType: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  identityDocNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  businessType: string;

  @ValidateNested()
  @ApiProperty({ type: SocialMediaDto })
  @Type(() => SocialMediaDto)
  socialMedia: SocialMediaDto;
}
