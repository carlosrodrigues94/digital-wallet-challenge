import { WithdrawEntity } from '@/domain/entities/withdraw.entity';

export type CreateWithdrawUseCaseParams = {
  amount: number;
  source: string;
  sourceTransactionId: string;
  userId: string;
};

export interface CreateWithdrawUseCase {
  execute(params: CreateWithdrawUseCaseParams): Promise<WithdrawEntity>;
}
