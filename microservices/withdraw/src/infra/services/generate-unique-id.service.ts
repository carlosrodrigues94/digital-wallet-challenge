import { randomUUID } from 'crypto';
import { GenerateUniqueIdService } from '@/data/services/generate-unique-id.service';

export class UniqueIdService implements GenerateUniqueIdService {
  generate(): string {
    return randomUUID();
  }
}
