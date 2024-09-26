import { Test, TestingModule } from '@nestjs/testing';
import { CommitteService } from './committe.service';

describe('CommitteService', () => {
  let service: CommitteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommitteService],
    }).compile();

    service = module.get<CommitteService>(CommitteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
