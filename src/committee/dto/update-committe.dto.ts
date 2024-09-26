import { PartialType } from '@nestjs/swagger';
import { CreateCommitteDto } from './create-committe.dto';

export class UpdateCommitteDto extends PartialType(CreateCommitteDto) {}
