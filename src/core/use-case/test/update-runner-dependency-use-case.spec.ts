import { createMock } from 'ts-auto-mock';
import { HealthCheckRepository } from '../../repository/health-check-repository';
import { UpdateDependencyRunnerUseCase } from '../update-runner-dependency-use-case';
import { DependencyStatusEnum } from '../../entities/dependency-status-enum';
import { DependencyRunnerRepository } from '../../repository/dependency-runner-repository';

describe('UpdateDependencyRunnerUseCase', () => {
  let healthCheckRepository: HealthCheckRepository;
  let updateRunnerDependencyUseCase: UpdateDependencyRunnerUseCase;

  beforeEach(() => {
    healthCheckRepository = createMock<HealthCheckRepository>({
      updateRunnerInDependency: jest.fn(),
    });
    updateRunnerDependencyUseCase = new UpdateDependencyRunnerUseCase(
      healthCheckRepository,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const dependencyName = 'dependency1';
  const runner = createMock<DependencyRunnerRepository>();

  it('should set dependency status in health check', async () => {
    await updateRunnerDependencyUseCase.execute({ dependencyName, runner });

    expect(
      healthCheckRepository.updateRunnerInDependency,
    ).toHaveBeenCalledTimes(1);
    expect(healthCheckRepository.updateRunnerInDependency).toHaveBeenCalledWith(
      dependencyName,
      runner,
    );
  });
});
