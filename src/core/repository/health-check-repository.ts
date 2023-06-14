import { DependencyStatusEnum } from '../entities/dependency-status-enum';
import { DependencyType } from '../entities/dependency-type';
import { HealthCheckType } from '../entities/health-check-type';
import { HealthCheckStatusEnum } from '../entities/health-status-enum';

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
