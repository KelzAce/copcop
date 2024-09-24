import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  certIncorpTrusteeUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  incorpTrusteeDocUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  constitutionDocUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  certIncorpUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  operatingLicenseUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  memorandumUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  additionalDocUrl: string;

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
}
