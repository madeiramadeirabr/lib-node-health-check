import { HealthCheckRepository } from '../../repository/health-check-repository';
import { createMock } from 'ts-auto-mock';
import { GetDependenciesUseCase } from '../get-health-check-use-case';
import { HealthCheckType } from '../../entities/health-check-type';
import { DependencyKindEnum } from '../../entities/dependency-kind-enum';
import { DependencyStatusEnum } from '../../entities/dependency-status-enum';
import { HealthCheckStatusEnum } from '../../entities/health-status-enum';

describe('GetDependenciesUseCase', () => {
  let healthCheckRepository: HealthCheckRepository;
  let getDependenciesUseCase: GetDependenciesUseCase;

  beforeEach(() => {
    healthCheckRepository = createMock<HealthCheckRepository>({
      setDependencies: jest.fn(),
    });
    getDependenciesUseCase = new GetDependenciesUseCase(healthCheckRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call getHealthCheck on the healthCheckRepository', async () => {
    const getHealthCheckSpy = jest.spyOn(
      healthCheckRepository,
      'getHealthCheck',
    );
    await getDependenciesUseCase.execute();
    expect(getHealthCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('should return the value returned by getHealthCheck', async () => {
    const healthCheckValue: HealthCheckType = {
      name: 'health-check',
      status: HealthCheckStatusEnum.Healthy,
      version: '1.0.0',
      timestamp: Date.now(),
      system: {
        cpu: {
          utilization: 0.5,
        },
        memory: {
          total: 100,
          used: 50,
        },
      },
      dependencies: [
        {
          name: 'dependency1',
          kind: DependencyKindEnum.S3,
          status: DependencyStatusEnum.Healthy,
          optional: false,
          internal: false,
        },
      ],
    };

    jest
      .spyOn(healthCheckRepository, 'getHealthCheck')
      .mockResolvedValue(healthCheckValue);

    const result = await getDependenciesUseCase.execute();
    expect(result).toBe(healthCheckValue);
  });
});
