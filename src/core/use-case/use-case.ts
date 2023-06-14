export class UseCaseBase<T = any, R = any> {
  public async execute(data: T): Promise<R> {
    throw new Error('Method not implemented.');
  }
}
