export interface HandleCreatedEventUseCase<T> {
  execute(params: T): void;
}
