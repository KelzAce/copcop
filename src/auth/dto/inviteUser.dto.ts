import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class inviteUserDto {
    @ApiProperty()
    @IsEmail()
    first_name: string;

    @ApiProperty()
    @IsEmail()
    last_name: string;

    @ApiProperty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsString()
    password: string;
  }