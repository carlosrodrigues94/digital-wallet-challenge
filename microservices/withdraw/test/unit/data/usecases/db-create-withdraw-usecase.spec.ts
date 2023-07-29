import { DBCreateWithdrawUsecase } from '@/data/usecases/db-create-withdraw.usecase';
import { CreateWithdrawUseCaseParams } from '@/domain/usecases/create-withdraw.usecase';
import { messageBrokerMock } from '@test/mocks/message-broker.mock';
import { uniqueIdServiceMock } from '@test/mocks/unique-id-service.mock';
import { withdrawEntityMock } from '@test/mocks/withdraw-entity.mock';
import { withdrawRepositoryMock } from '@test/mocks/withdraw-repository.mock';

describe('DbCreateWithdrawUseCase', () => {
  const usecase = new DBCreateWithdrawUsecase(
    messageBrokerMock,
    withdrawRepositoryMock,
    uniqueIdServiceMock,
  );
  it('should create withdraw successfully', async () => {
    const params: CreateWithdrawUseCaseParams = {
      amount: 100,
      source: 'pix',
      sourceTransactionId: 'pix-id',
      userId: 'user-id',
    };

    const result = await usecase.execute(params);
    expect(result).toEqual(withdrawEntityMock);
    expect(withdrawRepositoryMock.createWithdraw).toHaveBeenCalled();
    expect(messageBrokerMock.emitWithdrawCreatedEvent).toHaveBeenCalledWith(
      withdrawEntityMock,
    );
  });
});
