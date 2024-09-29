import { Test, TestingModule } from '@nestjs/testing';
import { RegulatorService } from './regulator.service';

describe('RegulatorService', () => {
  let service: RegulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegulatorService],
    }).compile();

    service = module.get<RegulatorService>(RegulatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
