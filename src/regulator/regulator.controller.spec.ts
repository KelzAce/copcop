import { Test, TestingModule } from '@nestjs/testing';
import { RegulatorController } from './regulator.controller';
import { RegulatorService } from './regulator.service';

describe('RegulatorController', () => {
  let controller: RegulatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegulatorController],
      providers: [RegulatorService],
    }).compile();

    controller = module.get<RegulatorController>(RegulatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
