import { DependencyStatusEnum } from '../../../core/entities/dependency-status-enum';
import { DependencyType } from '../../../core/entities/dependency-type';
import { HealthCheckType } from '../../../core/entities/health-check-type';
import { HealthCheckStatusEnum } from '../../../core/entities/health-status-enum';
import { HealthCheckRepository } from '../../../core/repository/health-check-repository';
import { Memory } from '../../datasource/memory/interface/memory-interface';

export class HashMapHealthCheck implements HealthCheckRepository {
  private readonly DependenciesKey = 'dependencies';
  private readonly HealthCheckKey = 'health-check';

  constructor(private cache: Memory) {}

  getHealthCheck(): Promise<HealthCheckType> {
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

  setHealthCheckStatus(status: HealthCheckStatusEnum): void {
    this.cache.set(this.HealthCheckKey, status);
  }
}
