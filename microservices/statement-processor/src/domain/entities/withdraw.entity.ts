export interface WithdrawEntity {
  id: string;
  userId: string;
  amount: number;
  source: string;
  sourceTransactionId: string;
  createdAt: string;
}
