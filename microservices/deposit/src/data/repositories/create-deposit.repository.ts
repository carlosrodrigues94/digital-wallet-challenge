import { DepositEntity } from '@/domain/entities/deposit.entity';

export type CreateDepositRepositoryParams = {
  amount: number;
  sourceDescription: string;
  sourceTransactionId: string;
  source: string;
  userId: string;
  createdAt: string;
  id: string;
};

export type CreateDepositRepositoryResult = DepositEntity;

export interface CreateDepositRepository {
  createDeposit(
    params: CreateDepositRepositoryParams,
  ): Promise<CreateDepositRepositoryResult>;
}
