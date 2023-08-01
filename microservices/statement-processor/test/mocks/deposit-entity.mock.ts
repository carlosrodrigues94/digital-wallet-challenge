import { DepositEntity } from '@/domain/entities/deposit.entity';

export const depositEntityMock: DepositEntity = {
  amount: 100,
  createdAt: '2023-07-29 00:00:00',
  id: 'deposit-id',
  source: 'pix',
  sourceDescription: 'pix-bank-name',
  sourceTransactionId: 'pix-id',
  userId: 'user-id',
};
