import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCooperativeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  presidentEmail: string;
 
}


