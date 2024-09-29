import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from 'src/auth/dto/admin.dto';


export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
