import { HandleCreatedDepositEventUseCase } from '@/data/usecases/handle-created-deposit-event.usecase.usecase';
import { messageBrokerMock } from '@test/mocks/message-broker.mock';
import { uniqueIdServiceMock } from '@test/mocks/unique-id-service.mock';
import { depositEntityMock } from '@test/mocks/deposit-entity.mock';
import { depositRepositoryMock } from '@test/mocks/deposit-repository.mock';
import { statementRepositoryMock } from '@test/mocks/statement-repository.mock';
import { statementEntityMock } from '@test/mocks/statement-entity.mock';

const date = new Date('2023-05-05 00:00:00');

jest.useFakeTimers().setSystemTime(date);

describe('HandleCreatedDepositEventUseCase', () => {
  const usecase = new HandleCreatedDepositEventUseCase(
    messageBrokerMock,
    depositRepositoryMock,
    statementRepositoryMock,
    uniqueIdServiceMock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle with the deposit created event', async () => {
    await usecase.execute(depositEntityMock);

    expect(depositRepositoryMock.createDeposit).toHaveBeenCalledWith(
      depositEntityMock,
    );
    expect(statementRepositoryMock.updateStatement).toHaveBeenCalled();
  });

  it('should handle with the deposit created event and the statement is undefined', async () => {
    jest
      .spyOn(statementRepositoryMock, 'findOneStatement')
      .mockImplementationOnce(() => Promise.resolve(undefined));

    await usecase.execute(depositEntityMock);

    expect(depositRepositoryMock.createDeposit).toHaveBeenCalledWith(
      depositEntityMock,
    );
    expect(statementRepositoryMock.createStatement).toHaveBeenCalled();
    expect(statementRepositoryMock.updateStatement).toHaveBeenCalledWith(
      statementEntityMock.id,
      {
        amount: statementEntityMock.amount + depositEntityMock.amount,
        updatedAt: date.toISOString(),
      },
    );
  });
});
