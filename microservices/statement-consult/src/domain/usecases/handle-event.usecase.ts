export interface HandleEventUseCase<T> {
  execute(payload: T): Promise<void>;
}
