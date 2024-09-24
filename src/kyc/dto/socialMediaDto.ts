import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
export class SocialMediaDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  facebookLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  instagramLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  tiktokLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  twitterLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  linkedinLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  websiteLink: string;
}
