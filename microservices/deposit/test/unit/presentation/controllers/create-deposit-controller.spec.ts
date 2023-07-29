import { CreateDepositUseCase } from '@/domain/usecases/create-deposit.usecase';
import { CreateDepositController } from '@/presentation/controllers/create-deposit.controller';
import { DbCreateDepositUseCaseFactory } from '@/presentation/factories/db-create-deposit-usecase.factory';
import { depositEntityMock } from '@test/mocks/deposit-entity.mock';

describe('CreateDepositController', () => {
  const usecase: CreateDepositUseCase = {
    execute: jest.fn(() => Promise.resolve(depositEntityMock)),
  };
  const factory = {
    build: () => usecase,
  } as unknown as DbCreateDepositUseCaseFactory;
  const controller = new CreateDepositController(factory);

  it('should be able to create a deposit', async () => {
    const body = {
      amount: 100,
      source: 'pix',
      sourceDescription: 'pix-bank-name',
      sourceTransactionId: 'pix-id',
      userId: 'user-id',
    };
    const result = await controller.createDeposit(body);

    expect(result).toEqual(depositEntityMock);
    expect(usecase.execute).toHaveBeenCalledWith(body);
  });
});
