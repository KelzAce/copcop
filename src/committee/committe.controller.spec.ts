import { Test, TestingModule } from '@nestjs/testing';
import { CommitteController } from './committe.controller';
import { CommitteService } from './committe.service';

describe('CommitteController', () => {
  let controller: CommitteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteController],
      providers: [CommitteService],
    }).compile();

    controller = module.get<CommitteController>(CommitteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
