import { DependencyStatusEnum } from '../entities/dependency-status-enum';
import { DependencyType } from '../entities/dependency-type';
import { HealthCheckBasicInfo } from '../entities/health-check-basic-info-type';
import { HealthCheckType } from '../entities/health-check-type';
import { DependencyRunnerRepository } from './dependency-runner-repository';

export interface HealthCheckRepository {
  getHealthCheck(): Promise<HealthCheckType>;
  setDependencies(dependencies: DependencyType[]): void;
  setDependencyStatus(
    dependencyName: string,
    status: DependencyStatusEnum,
  ): void;
  setHealthCheckBasicInfo(basicInfo: HealthCheckBasicInfo): void;
  updateRunnerInDependency(
    dependencyName: string,
    runner: DependencyRunnerRepository | null,
  ): void;
}
