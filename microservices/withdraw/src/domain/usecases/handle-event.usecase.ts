export interface HandleEventUseCase<T> {
  execute(data: T): Promise<void>;
}
