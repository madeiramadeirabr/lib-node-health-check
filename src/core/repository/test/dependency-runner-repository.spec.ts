import { DependencyStatusEnum } from '../../entities/dependency-status-enum';
import { DependencyRunnerRepository } from '../dependency-runner-repository';

class MockDependencyRunnerRepository extends DependencyRunnerRepository {
  protected getStatus(): Promise<DependencyStatusEnum | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DependencyStatusEnum.Healthy);
      }, 50);
    });
  }
}

class MockDependencyRunnerRepositoryError extends DependencyRunnerRepository {
  protected getStatus(): Promise<DependencyStatusEnum | undefined> {
    throw new Error('Failed to get status');
  }
}

describe('DependencyRunnerRepository', () => {
  let dependencyRunnerRepository: DependencyRunnerRepository;

  beforeEach(() => {
    dependencyRunnerRepository = new MockDependencyRunnerRepository();
  });

  it('should return the status when it is available within the timeout', async () => {
    const status = await dependencyRunnerRepository.getStatusCheck();
    expect(status).toEqual(DependencyStatusEnum.Healthy);
  });

  it('should return Unavailable status when getStatus() takes longer than the timeout', async () => {
    dependencyRunnerRepository.RUNNER_MS_TIMEOUT = 0;

    const status = await dependencyRunnerRepository.getStatusCheck();
    expect(status).toEqual(DependencyStatusEnum.Unavailable);
  });

  it('should return Unavailable status when an error occurs in getStatus()', async () => {
    const dependencyRunnerRepositoryError =
      new MockDependencyRunnerRepositoryError(); 

    const status = await dependencyRunnerRepositoryError.getStatusCheck();
    expect(status).toBe(DependencyStatusEnum.Unavailable);
  });
});
