import { WithdrawEntity } from '@/domain/entities/withdraw.entity';

export type CreateWithdrawRepositoryParams = WithdrawEntity;
export type CreateWithdrawRepositoryResult = WithdrawEntity;

export interface CreateWithdrawRepository {
  createWithdraw(
    params: CreateWithdrawRepositoryParams,
  ): Promise<WithdrawEntity>;
}
