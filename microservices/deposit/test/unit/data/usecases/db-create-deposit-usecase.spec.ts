import { DBCreateDepositUsecase } from '@/data/usecases/db-create-deposit.usecase';
import { CreateDepositUseCaseParams } from '@/domain/usecases/create-deposit.usecase';
import { depositEntityMock } from '@test/mocks/deposit-entity.mock';
import { depositRepositoryMock } from '@test/mocks/deposit-repository.mock';
import { messageBrokerMock } from '@test/mocks/message-broker.mock';
import { uniqueIdServiceMock } from '@test/mocks/unique-id-service.mock';

describe('DBCreateDepositUsecase', () => {
  const usecase = new DBCreateDepositUsecase(
    messageBrokerMock,
    depositRepositoryMock,
    uniqueIdServiceMock,
  );
  it('should create deposit successfully', async () => {
    const params: CreateDepositUseCaseParams = {
      amount: 100,
      source: 'pix',
      sourceDescription: 'pix-bank-name',
      sourceTransactionId: 'pix-id',
      userId: 'user-id',
    };

    const result = await usecase.execute(params);
    expect(result).toEqual(depositEntityMock);
    expect(depositRepositoryMock.createDeposit).toHaveBeenCalled();
    expect(messageBrokerMock.emitDepositCreatedEvent).toHaveBeenCalledWith(
      depositEntityMock,
    );
  });
});
