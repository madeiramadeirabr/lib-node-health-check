import { createMock } from 'ts-auto-mock';
import { HealthCheckRepository } from '../../repository/health-check-repository';
import { SetDependenciesStatusUseCase } from '../set-dependencies-status-use-case';
import { DependencyStatusEnum } from '../../entities/dependency-status-enum';

describe('SetDependenciesStatusUseCase', () => {
  let healthCheckRepository: HealthCheckRepository;
  let setDependenciesStatusUseCase: SetDependenciesStatusUseCase;

  beforeEach(() => {
    healthCheckRepository = createMock<HealthCheckRepository>({
      setDependencies: jest.fn(),
    });
    setDependenciesStatusUseCase = new SetDependenciesStatusUseCase(
      healthCheckRepository,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call setDependencyStatus() on the healthCheckRepository with correct arguments', () => {
    const dependencyName = 'example';
    const dependencyStatus = DependencyStatusEnum.Unavailable;

    const setDependencyStatusSpy = jest.spyOn(
      healthCheckRepository,
      'setDependencyStatus',
    );

    setDependenciesStatusUseCase.execute({
      name: dependencyName,
      status: dependencyStatus,
    });

    expect(setDependencyStatusSpy).toHaveBeenCalledWith(
      dependencyName,
      dependencyStatus,
    );
  });

  it('should not throw an error when executing', async () => {
    const executeAsync = async () => {
      await setDependenciesStatusUseCase.execute({
        name: 'example',
        status: DependencyStatusEnum.Unavailable,
      });
    };
    await expect(executeAsync).not.toThrow();
  });
});
