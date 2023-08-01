import { messageBrokerMock } from '@test/mocks/message-broker.mock';
import { uniqueIdServiceMock } from '@test/mocks/unique-id-service.mock';
import { statementRepositoryMock } from '@test/mocks/statement-repository.mock';
import { HandleCreatedWithdrawEventUseCase } from '@/data/usecases/handle-created-withdraw-event.usecase.usecase';
import { withdrawRepositoryMock } from '@test/mocks/withdraw-repository.mock';
import { withdrawEntityMock } from '@test/mocks/withdraw-entity.mock';

const date = new Date('2023-05-05 00:00:00');

jest.useFakeTimers().setSystemTime(date);

describe('HandleCreatedWithdrawEventUseCase', () => {
  const usecase = new HandleCreatedWithdrawEventUseCase(
    messageBrokerMock,
    withdrawRepositoryMock,
    statementRepositoryMock,
    uniqueIdServiceMock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle with the withdraw created event', async () => {
    await usecase.execute(withdrawEntityMock);

    expect(withdrawRepositoryMock.createWithdraw).toHaveBeenCalledWith(
      withdrawEntityMock,
    );
    expect(statementRepositoryMock.updateStatement).toHaveBeenCalled();
  });
});
