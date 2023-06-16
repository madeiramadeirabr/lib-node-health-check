import { SetDependenciesUseCase } from '../set-dependencies-use-case';
import { HealthCheckRepository } from '../../repository/health-check-repository';
import { createMock } from 'ts-auto-mock';
import { DependencyKindEnum } from '../../entities/dependency-kind-enum';
import { DependencyType } from '../../entities/dependency-type';
import { DependencyStatusEnum } from '../../entities/dependency-status-enum';

describe('SetDependenciesUseCase', () => {
  let healthCheckRepository: HealthCheckRepository;
  let setDependenciesUseCase: SetDependenciesUseCase;

  beforeEach(() => {
    healthCheckRepository = createMock<HealthCheckRepository>({
      setDependencies: jest.fn(),
    });
    setDependenciesUseCase = new SetDependenciesUseCase(healthCheckRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const dependencies: DependencyType[] = [
    {
      name: 'dependency1',
      kind: DependencyKindEnum.S3,
      status: DependencyStatusEnum.Healthy,
      optional: false,
      internal: false,
    },
    {
      name: 'dependency2',
      kind: DependencyKindEnum.Mongodb,
      status: DependencyStatusEnum.Healthy,
      optional: false,
      internal: true,
    },
  ];

  it('should set dependencies in health check', async () => {
    await setDependenciesUseCase.execute(dependencies);

    expect(healthCheckRepository.setDependencies).toHaveBeenCalledTimes(1);
    expect(healthCheckRepository.setDependencies).toHaveBeenCalledWith(
      dependencies,
    );
  });
});
