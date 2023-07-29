import { UniqueIdService } from '@/infra/services/generate-unique-id.service';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'any_id'),
}));

describe('UniqueIdService', () => {
  const uniqueIdService = new UniqueIdService();
  it('should generate a unique id', () => {
    expect(uniqueIdService.generate()).toBe('any_id');
  });
});
