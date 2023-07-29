import { DepositEntity } from '@/domain/entities/deposit.entity';

export type CreateDepositUseCaseParams = {
  amount: number;
  sourceDescription: string;
  sourceTransactionId: string;
  source: string;
  userId: string;
};

export interface CreateDepositUseCase {
  execute(payload: CreateDepositUseCaseParams): Promise<DepositEntity>;
}
