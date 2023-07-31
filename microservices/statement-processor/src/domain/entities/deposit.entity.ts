export interface DepositEntity {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  sourceDescription: string;
  sourceTransactionId: string;
  source: string;
}
