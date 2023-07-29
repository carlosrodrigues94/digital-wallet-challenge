import { CreateWithdrawUseCase } from '@/domain/usecases/create-withdraw.usecase';
import { CreateWithdrawController } from '@/presentation/controllers/create-withdraw.controller';
import { DbCreateWithdrawUseCaseFactory } from '@/presentation/factories/db-create-withdraw-usecase.factory';
import { withdrawEntityMock } from '@test/mocks/withdraw-entity.mock';

describe('CreateWithdrawController', () => {
  const usecase: CreateWithdrawUseCase = {
    execute: jest.fn(() => Promise.resolve(withdrawEntityMock)),
  };
  const factory = {
    build: () => usecase,
  } as unknown as DbCreateWithdrawUseCaseFactory;
  const controller = new CreateWithdrawController(factory);

  it('should be able to create a withdraw', async () => {
    const body = {
      amount: 100,
      source: 'pix',
      sourceDescription: 'pix-bank-name',
      sourceTransactionId: 'pix-id',
      userId: 'user-id',
    };
    const result = await controller.createWithdraw(body);

    expect(result).toEqual(withdrawEntityMock);
    expect(usecase.execute).toHaveBeenCalledWith(body);
  });
});
