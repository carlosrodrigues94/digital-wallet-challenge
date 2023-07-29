import { GenerateUniqueIdService } from '@/data/services/generate-unique-id.service';

export const uniqueIdServiceMock: GenerateUniqueIdService = {
  generate: jest.fn(() => 'id'),
};
