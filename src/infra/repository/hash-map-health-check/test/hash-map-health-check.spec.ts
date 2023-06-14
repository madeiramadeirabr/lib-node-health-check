import { createMock } from 'ts-auto-mock';
import { Memory } from '../../../../infra/datasource/memory/interface/memory-interface';
import { HashMapHealthCheck } from '../hash-map-health-check';
import { DependencyType } from '../../../../core/entities/dependency-type';
import { DependencyKindEnum } from '../../../../core/entities/dependency-kind-enum';
import { DependencyStatusEnum } from '../../../../core/entities/dependency-status-enum';
import { HealthCheckStatusEnum } from '../../../../core/entities/health-status-enum';

describe('HashMapHealthCheck', () => {
  let hashMap: HashMapHealthCheck;
  let cache: Memory;

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

  beforeEach(() => {
    cache = createMock<Memory>({ set: jest.fn(), get: jest.fn() });

    hashMap = new HashMapHealthCheck(cache);
  });

  it('should set dependencies correctly', () => {
    hashMap.setDependencies(dependencies);

    expect(cache.set).toHaveBeenCalledWith('dependencies', dependencies);
  });

  it('should set dependency status correctly', () => {
    const dependencyName = 'dependency1';
    const status = 'UP';

    const dependencies = [
      { name: 'dependency1', status: 'DOWN' },
      { name: 'dependency2', status: 'UP' },
    ];

    jest.spyOn(cache, 'get').mockReturnValue(dependencies);

    hashMap.setDependencyStatus(
      dependencyName,
      DependencyStatusEnum.Unavailable,
    );

    expect(cache.get).toHaveBeenCalledWith('dependencies');
    expect(dependencies[0].status).toEqual(status);
  });

  it('should set health check status correctly', () => {
    const status = HealthCheckStatusEnum.Unhealthy;

    hashMap.setHealthCheckStatus(status);

    expect(cache.set).toHaveBeenCalledWith('health-check', status);
  });

  it('should throw an error for unimplemented method getHealthCheck()', async () => {
    await expect(hashMap.getHealthCheck()).rejects.toThrow(
      'Method not implemented.',
    );
  });
});
