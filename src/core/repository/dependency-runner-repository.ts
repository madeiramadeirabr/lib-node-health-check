import { DependencyStatusEnum } from '../entities/dependency-status-enum';

export abstract class DependencyRunnerRepository {
  public RUNNER_MS_TIMEOUT = 1000;
  
  protected abstract getStatus(): Promise<DependencyStatusEnum | undefined>;

  async getStatusCheck(): Promise<DependencyStatusEnum | undefined> {
    
    const timeoutPromise = new Promise<DependencyStatusEnum>((resolve) => {
      setTimeout(() => {
        resolve(DependencyStatusEnum.Unavailable);
      }, this.RUNNER_MS_TIMEOUT);
    });

    try {
      const status = await Promise.race([this.getStatus(), timeoutPromise]);
      return status;
    } catch (error) {
      return DependencyStatusEnum.Unavailable;
    }
  }
}
