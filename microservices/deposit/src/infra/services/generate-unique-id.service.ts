import { GenerateUniqueIdService } from '@/data/services/generate-unique-id.service';
import { randomUUID } from 'crypto';

export class UniqueIdService implements GenerateUniqueIdService {
  generate(): string {
    return randomUUID();
  }
}
