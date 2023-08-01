import { WithdrawEntity } from '@/domain/entities/withdraw.entity';

export const withdrawEntityMock: WithdrawEntity = {
  amount: 100,
  createdAt: '2023-07-29 00:00:00',
  id: 'withdraw-id',
  source: 'pix',
  sourceTransactionId: 'pix-id',
  userId: 'user-id',
};
