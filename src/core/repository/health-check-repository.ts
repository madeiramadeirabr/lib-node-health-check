import { DependencyStatusEnum } from 'core/entities/dependency-status-enum';
import { DependencyType } from 'core/entities/dependency-type';
import { HealthCheckType } from 'core/entities/health-check-type';
import { HealthCheckStatusEnum } from 'core/entities/health-status-enum';

export interface HealthCheckRepository {
  getHealthCheck(): Promise<HealthCheckType>;
  setDependencies(dependencies: DependencyType[]): void;
  setDependencyStatus(
    dependencyName: string,
    status: DependencyStatusEnum,
  ): void;
  //TODO I don't think this is a good idea
  setHealthCheckStatus(status: HealthCheckStatusEnum): void;
}
