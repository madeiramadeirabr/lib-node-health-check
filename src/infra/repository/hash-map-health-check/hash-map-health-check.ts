import { DependencyStatusEnum } from '../../../core/entities/dependency-status-enum';
import { DependencyType } from '../../../core/entities/dependency-type';
import { HealthCheckBasicInfo } from '../../../core/entities/health-check-basic-info-type';
import { HealthCheckType } from '../../../core/entities/health-check-type';
import { HealthCheckRepository } from '../../../core/repository/health-check-repository';
import { Memory } from '../../datasource/memory/interface/memory-interface';

export class HashMapHealthCheck implements HealthCheckRepository {
  private readonly DependenciesKey = 'dependencies';
  private readonly HealthCheckKey = 'health-check';
  private readonly basicInfoKey = 'basic-info';

  constructor(private cache: Memory) {}

  setHealthCheckBasicInfo(basicInfo: HealthCheckBasicInfo): void {
    this.cache.set(this.basicInfoKey, basicInfo);
  }

  getBasicInfo(): HealthCheckBasicInfo {
    return this.cache.get<HealthCheckBasicInfo>(this.basicInfoKey);
  }

  getHealthCheck(): Promise<HealthCheckType> {
    //TODO
    throw new Error('Method not implemented.');
  }

  setDependencies(dependencies: DependencyType[]): void {
    this.cache.set(this.DependenciesKey, dependencies);
  }

  setDependencyStatus(
    dependencyName: string,
    status: DependencyStatusEnum,
  ): void {
    this.cache
      .get<DependencyType[]>(this.DependenciesKey)
      .forEach((dependency) => {
        if (dependency.name === dependencyName) {
          dependency.status = status;
        }
      });
  }
}
