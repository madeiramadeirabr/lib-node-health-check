import { createMock } from 'ts-auto-mock';
import { Memory } from '../../../../infra/datasource/memory/interface/memory-interface';
import { HashMapHealthCheck } from '../hash-map-health-check';
import { DependencyType } from '../../../../core/entities/dependency-type';
import { DependencyKindEnum } from '../../../../core/entities/dependency-kind-enum';
import { DependencyStatusEnum } from '../../../../core/entities/dependency-status-enum';

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
    const status = DependencyStatusEnum.Unavailable;

    jest.spyOn(cache, 'get').mockReturnValue(dependencies);

    hashMap.setDependencyStatus(
      dependencyName,
      DependencyStatusEnum.Unavailable,
    );

    expect(cache.get).toHaveBeenCalledWith('dependencies');
    expect(dependencies[0].status).toEqual(status);
  });

  it('should set health check basic info correctly', () => {
    const basicInfo = {
      name: 'name',
      version: 'version',
    };

    hashMap.setHealthCheckBasicInfo(basicInfo);

    expect(cache.set).toHaveBeenCalledWith('basic-info', basicInfo);
  });

  it('should get health check basic info correctly', () => {
    const basicInfo = {
      name: 'name',
      version: 'version',
    };

    jest.spyOn(cache, 'get').mockReturnValue(basicInfo);

    const result = hashMap.getBasicInfo();

    expect(cache.get).toHaveBeenCalledWith('basic-info');
    expect(result).toEqual(basicInfo);
  });
});
