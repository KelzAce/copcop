import { PartialType } from '@nestjs/swagger';
import { CreateRegulatorDto } from './create-regulator.dto';

export class UpdateRegulatorDto extends PartialType(CreateRegulatorDto) {}
